import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    message: 'hle!',
    data: {
      message: 'Message and email sent successfully!',
    }
  }, { status: 200 });
};