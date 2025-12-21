import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.slug;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${baseUrl}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      idOwner,
      name,
      cabangId,
      email,
      role,
      store,
      emailOwner,
      password,
    } = body;

    if (!idOwner || !name || !role || !store || !emailOwner || !cabangId)
      return NextResponse.json(
        { error: "Incomplete user data" },
        { status: 400 }
      );

    const id = params.slug;

    const encodedPassword = password
      ? Buffer.from(password).toString("base64")
      : undefined;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        ...(encodedPassword && { password: encodedPassword }),
        cabangId,
        role,
        store,
        parent: emailOwner,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.slug;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
