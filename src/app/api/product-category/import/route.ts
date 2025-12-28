import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formDataReq = await req.formData();
    const file = formDataReq.get("file") as File | null;
    const idOwner = formDataReq.get("idOwner") as string | null;

    if (!file || !idOwner) {
      return NextResponse.json(
        { error: "File atau owner tidak ditemukan" },
        { status: 400 }
      );
    }

    const forwardForm = new FormData();
    forwardForm.append("file", file);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(
      `${baseUrl}/produk-kategori/${idOwner}/get-by-owner/import`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: forwardForm,
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to import product category" },
      { status: 500 }
    );
  }
}