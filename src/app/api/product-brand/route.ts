import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  const idOwner = searchParams.get("id");

  if (!idOwner)
    return NextResponse.json({ error: "Parameter not found" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(
    `${baseUrl}/produk-merk/${idOwner}/get-by-owner`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { idOwner, name, code } = body;

    if (!idOwner || !name || !code)
      return NextResponse.json(
        { error: "Incomplete product brand data" },
        { status: 400 }
      );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/produk-merk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: idOwner,
        name,
        code,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product brand" },
      { status: 500 }
    );
  }
}
