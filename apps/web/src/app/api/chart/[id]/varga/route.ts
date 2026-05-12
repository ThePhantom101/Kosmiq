import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "https://astro-engine-809930924347.asia-south1.run.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (id === "me") {
    return NextResponse.json(
      { error: "The 'me' alias is client-side only. Divisional data for 'me' is served directly from local context." },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const division = searchParams.get("division");

  if (!division) {
    return NextResponse.json({ error: "Division parameter required" }, { status: 400 });
  }

  try {
    const engineUrl = `${ASTRO_ENGINE_URL}/chart/${id}/varga?division=${division}`;
    const response = await fetch(engineUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine varga error:", response.status, errorText);
      return NextResponse.json(
        { error: `Engine error: ${errorText}` },
        { status: response.status }
      );
    }

    const vargaData = await response.json();
    return NextResponse.json(vargaData);
  } catch (error) {
    console.error("Varga proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (id !== "me") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/calculate/varga?division=${division || 1}`;
    const response = await fetch(engineUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine varga calculation error:", response.status, errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Varga calculation proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
