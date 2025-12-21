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
    `${baseUrl}/transaksi/${idOwner}/get-by-owner/all/cabang`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const transactionData = await response.json();

  const transactionWithBranch = await Promise.all(
    transactionData.data.map(async (v: any) => {
      const branchRes = await fetch(`${baseUrl}/cabang/${v.cabangId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const branch = await branchRes.json();
      return {
        ...v,
        branch: branch.data,
      };
    })
  );

  return NextResponse.json(
    { data: transactionWithBranch },
    { status: response.status }
  );
}
