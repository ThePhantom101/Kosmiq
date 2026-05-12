import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params.path);
}

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  return proxyRequest(req, params.path);
}

async function proxyRequest(req: NextRequest, path: string[]) {
  const searchParams = req.nextUrl.searchParams.toString();
  // Handle trailing slashes which are important for some PostHog endpoints
  const pathString = path.join('/') + (req.nextUrl.pathname.endsWith('/') ? '/' : '');
  
  const targetHost = pathString.startsWith('static') ? 'us-assets.i.posthog.com' : 'app.posthog.com';
  const url = `https://${targetHost}/${pathString}${searchParams ? `?${searchParams}` : ''}`;
  
  const headers = new Headers();
  // Only pass essential headers to avoid mangling the request
  const headersToForward = ['content-type', 'user-agent', 'x-posthog-token'];
  headersToForward.forEach(h => {
    const val = req.headers.get(h);
    if (val) headers.set(h, val);
  });
  
  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headers,
      redirect: 'follow',
      // @ts-ignore
      signal: AbortSignal.timeout(15000), 
    };

    if (req.method === 'POST') {
      fetchOptions.body = await req.arrayBuffer();
    }

    const res = await fetch(url, fetchOptions);

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    
    const body = await res.arrayBuffer();
    
    return new NextResponse(body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`PostHog Proxy Error (${url}):`, error);
    return new NextResponse(null, { status: 204 });
  }
}
