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
  const response = await fetch(`${baseUrl}/stok-cabang/${id}`, {
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
    const { idOwner, name, code } = body;

    if (!idOwner || !name || !code)
      return NextResponse.json(
        { error: "Incomplete stock product data" },
        { status: 400 }
      );

    const id = params.slug;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/stock-cabang/${id}`, {
      method: "PUT",
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
      { error: "Failed to update product category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.slug;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const resStock = await fetch(`${baseUrl}/stok-cabang/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const dataStock = await resStock.json();

    if (!resStock.ok)
      return NextResponse.json(dataStock, { status: resStock.status });

    const { searchParams } = new URL(req.url);
    const idProduct = searchParams.get("idProduct");

    const resProduct = await fetch(`${baseUrl}/produk/${idProduct}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const dataProduct = await resProduct.json();

    if (!resProduct.ok) {
      return NextResponse.json(
        {
          warning: "Stock successfully deleted, but failed to delete product",
          ...dataProduct,
        },
        { status: resProduct.status }
      );
    }

    return NextResponse.json(
      {
        message: "Stock and product successfully deleted",
        dataStock,
        dataProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete stock product" },
      { status: 500 }
    );
  }
}
