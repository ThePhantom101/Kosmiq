import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "https://astro-engine-809930924347.asia-south1.run.app";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "today";
  const lat = searchParams.get("lat") || "0.0";
  const lng = searchParams.get("lng") || "0.0";

  const debug = searchParams.get("debug") === "true";

  if (debug) {
    return NextResponse.json({ 
      ASTRO_ENGINE_URL,
      env: process.env.ASTRO_ENGINE_URL ? "SET" : "NOT SET",
      url: `${ASTRO_ENGINE_URL}/api/v1/sky/panchang`
    });
  }

  try {
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/sky/panchang?date=${date}&lat=${lat}&lng=${lng}`;
    const response = await fetch(engineUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine panchang error:", response.status, errorText);
      return NextResponse.json(
        { error: `Engine error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Panchang proxy error:", error);
    return NextResponse.json({ error: "Internal server error", message: error.message, stack: error.stack }, { status: 500 });
  }
}
