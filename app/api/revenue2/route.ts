import { NextResponse } from "next/server";
import { fetchRevenue2 } from "@/app/lib/data";

export async function GET() {
  try {
    const data = await fetchRevenue2();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API error fetching revenue2", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
