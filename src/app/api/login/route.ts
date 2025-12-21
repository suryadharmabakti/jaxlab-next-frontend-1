import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, rememberMe } = await req.json();

  const credentials = Buffer.from(`${email}:${password}`).toString("base64");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const res = NextResponse.json(data);
  res.cookies.set({
    name: "token",
    value: data.data.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    ...(rememberMe ? {} : { maxAge: 60 * 60 * 24 }), // 1 hari
  });

  return res;
}
