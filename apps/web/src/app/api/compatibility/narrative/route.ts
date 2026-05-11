import { NextRequest, NextResponse } from "next/server";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${ASTRO_ENGINE_URL}/api/v1/compatibility/narrative`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Compatibility narrative proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
