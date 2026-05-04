"use server";

export async function searchLocation(query: string) {
  try {
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
    if (!res.ok) throw new Error("Location search failed");
    return await res.json();
  } catch (err) {
    console.error("Location search error:", err);
    return { features: [] };
  }
}

export async function getTimezone(lat: number, lon: number) {
  try {
    const res = await fetch(`https://www.timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`);
    if (!res.ok) throw new Error("Timezone fetch failed");
    return await res.json();
  } catch (err) {
    console.error("Timezone fetch error:", err);
    return null;
  }
}
