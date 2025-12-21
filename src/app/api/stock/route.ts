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
  const resStok = await fetch(
    `${baseUrl}/stok-cabang/${idOwner}/get-by-owner/all/cabang`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const stokData = await resStok.json();

  if (!resStok.ok)
    return NextResponse.json(stokData, { status: resStok.status });

  const stokWithRelations = await Promise.all(
    stokData.data.map(async (v: any) => {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [produkRes, kategoriRes, merkRes, cabangRes] = await Promise.all([
        fetch(`${baseUrl}/produk/${v.produkId}`, { headers }),
        fetch(`${baseUrl}/produk-kategori/${v.produkKategoriId}`, { headers }),
        fetch(`${baseUrl}/produk-merk/${v.produkMerkId}`, { headers }),
        fetch(`${baseUrl}/cabang/${v.cabangId}`, { headers }),
      ]);

      const [produk, produkKategori, produkMerk, cabang] = await Promise.all([
        produkRes.json(),
        kategoriRes.json(),
        merkRes.json(),
        cabangRes.json(),
      ]);

      return {
        ...v,
        produk: produkRes.ok ? produk.data : null,
        produkMerk: merkRes.ok ? produkMerk.data : null,
        produkKategori: kategoriRes.ok ? produkKategori.data : null,
        cabang: cabangRes.ok ? cabang.data : null,
      };
    })
  );

  return NextResponse.json({ data: stokWithRelations }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      idOwner,
      name,
      code,
      qty,
      harga,
      hargaModal,
      satuan,
      cabangId,
      produkKategoriId,
      produkMerkId,
      image,
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // insert product
    const productForm = new FormData();

    let fileBlob: Blob | null = null;
    if (image && image.startsWith("data:")) {
      const res = await fetch(image);
      fileBlob = await res.blob();
    }

    productForm.append(
      "data",
      JSON.stringify({
        userId: idOwner,
        code,
        name,
      })
    );

    if (fileBlob) {
      productForm.append("file", fileBlob, "image.png");
    }

    const resProduct = await fetch(
      `${baseUrl}/produk/${idOwner}/get-by-owner/insert`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productForm,
      }
    );

    const productResult = await resProduct.json();

    if (!resProduct.ok) {
      return NextResponse.json(productResult, { status: resProduct.status });
    }

    const produkId = productResult.data?._id;

    if (!produkId)
      return NextResponse.json(
        { error: "Produk ID tidak ditemukan" },
        { status: 500 }
      );

    // insert stock
    const resStock = await fetch(`${baseUrl}/stok-cabang`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: idOwner,
        name,
        code,
        qty,
        harga,
        hargaModal,
        satuan,
        cabangId,
        produkKategoriId,
        produkMerkId,
        produkId: produkId,
      }),
    });

    const data = await resStock.json();

    return NextResponse.json(data, { status: resStock.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
