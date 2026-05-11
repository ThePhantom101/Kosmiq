import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chart_id = searchParams.get("chart_id");
  const month = searchParams.get("month");

  if (!chart_id || !month) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/predictions/monthly?chart_id=${chart_id}&month=${month}`;
    const response = await fetch(engineUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine monthly forecast error:", response.status, errorText);
      return NextResponse.json(
        { error: `Engine error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Monthly forecast proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const body = await request.json();

  if (!month) {
    return NextResponse.json({ error: "Missing month parameter" }, { status: 400 });
  }

  try {
    // Forward to the POST variant in the engine
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/predictions/monthly?month=${month}`;
    const response = await fetch(engineUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Engine error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Monthly forecast POST proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
