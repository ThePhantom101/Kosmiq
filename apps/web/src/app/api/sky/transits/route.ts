import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chartId = searchParams.get("chart_id");

  if (!chartId) {
    return NextResponse.json({ error: "chart_id is required" }, { status: 400 });
  }

  try {
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/sky/transits/current?chart_id=${chartId}`;
    const response = await fetch(engineUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine transits error:", response.status, errorText);
      return NextResponse.json(
        { error: `Engine error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Transits proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
