"use server";

import { db } from "@/db";
import { profiles, charts, users } from "../db/schema";
import { revalidatePath } from "next/cache";

const ASTRO_ENGINE_URL = process.env.ASTRO_ENGINE_URL || "http://localhost:8000";

export async function generateChartAction(formData: {
  name: string;
  date: string;
  time: string;
  lat: number;
  long: number;
  tz: number;
}) {
  try {
    // 1. Get or Create dummy user for development
    let user = await db.query.users.findFirst();
    if (!user) {
      [user] = await db.insert(users).values({
        email: "dev@kosmiq.ai",
        subscriptionTier: "pro",
      }).returning();
    }

    // 2. Create Profile
    const [profile] = await db.insert(profiles).values({
      userId: user.id,
      name: formData.name,
      dob: formData.date,
      tob: formData.time,
      lat: formData.lat.toString(),
      long: formData.long.toString(),
      tzOffset: formData.tz,
    }).returning();

    // 3. Call Astro Engine
    const response = await fetch(`${ASTRO_ENGINE_URL}/api/v1/calculate/chart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date_of_birth: formData.date,
        time_of_birth: formData.time,
        latitude: formData.lat,
        longitude: formData.long,
        timezone_offset: formData.tz,
      }),
    });

    if (!response.ok) {
      throw new Error(`Astro Engine failed: ${await response.text()}`);
    }

    const calcData = await response.json();

    // 4. Save Chart
    const [chart] = await db.insert(charts).values({
      profileId: profile.id,
      planetaryDegrees: calcData.planets,
      shodashvarga: calcData.shodashvarga,
      planetaryStrengths: calcData.planetary_strengths,
      ashtakavarga: calcData.ashtakavarga,
    }).returning();

    revalidatePath("/");
    return { success: true, chartId: chart.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in generateChartAction:", error);
    return { success: false, error: message };
  }
}
