import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "https://astro-engine-809930924347.asia-south1.run.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const engineUrl = `${ASTRO_ENGINE_URL}/chart/${id}/yogas`;
    const response = await fetch(engineUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine yogas error:", response.status, errorText);
      return NextResponse.json(
        { error: `Engine error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Yogas proxy error:", error);
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
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/calculate/yogas`;
    const response = await fetch(engineUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine yogas calculation error:", response.status, errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Yogas calculation proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
