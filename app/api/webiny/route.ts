import { NextRequest, NextResponse } from "next/server";
import { webinyClient } from "@/app/lib/webiny";

export async function POST(req: NextRequest) {
  try {
    const { type, query, variables } = await req.json();
    const data = await webinyClient(type, query, { variables });
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("/api/webiny error", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  // simple health check or info endpoint
  return NextResponse.json({ ok: true, message: "Webiny proxy up" });
}
