import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const engineUrl = `${ASTRO_ENGINE_URL}/api/user/biodata`;
    
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
    console.error("Biodata proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
