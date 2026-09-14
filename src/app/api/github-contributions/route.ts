import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || "last";
  const username = searchParams.get("username") || "veeeene";

  try {
    const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Upstream API returned status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 500 }
    );
  }
}
