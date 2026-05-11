import { NextResponse } from "next/server";
const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "http://localhost:8000";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(`${ASTRO_ENGINE_URL}/chart/${id}/shadbala`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch shadbala from engine" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Shadbala Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (id !== "me") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const engineUrl = `${ASTRO_ENGINE_URL}/api/v1/calculate/shadbala`;
    const response = await fetch(engineUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Astro Engine shadbala calculation error:", response.status, errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Shadbala calculation proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
