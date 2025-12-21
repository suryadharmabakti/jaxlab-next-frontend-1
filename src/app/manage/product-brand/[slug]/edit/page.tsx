"use client";

import AppShell from "@/components/AppShell";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "../../page";
import { toast } from "sonner";
import SidebarTrigger from "@/components/SidebarTrigger";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.slug as string;

  const [draft, setDraft] = useState<Brand>({ _id: "", name: "", code: "" });

  const handleSave = async () => {
    const nextName = draft.name.trim();
    const nextCode = draft.code.trim();

    if (!nextName || !nextCode) {
      alert("Mohon lengkapi: nama merk dan kode merk.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch(`/api/product-brand/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOwner: user._id,
          name: draft.name,
          code: draft.code,
        }),
      });

      if (result.status === 401) {
        toast.error("Your session has ended. Please log in again.");
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      if (!result.ok)
        throw new Error("Failed to update product brand data.");

      toast.success("Product brand successfully updated.");
      router.push("/manage/product-brand");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const fetchById = async () => {
    try {
      const res = await fetch(`/api/product-brand/${id}`);

      if (!res.ok) throw new Error("Failed to retrieve product brand data");

      const data = await res.json();

      setDraft({
        _id: data.data._id,
        name: data.data.name,
        code: data.data.code,
      });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchById();
  }, [id]);

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mb-5">
            <SidebarTrigger />
            <p className="text-xs text-gray-400">|</p>
            <div className="text-xs text-gray-400">
              Kelola Cabang &nbsp;›&nbsp; Merk Produk &nbsp;›&nbsp; Edit
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <h6 className="text-md font-semibold text-gray-900 whitespace-nowrap">
            Edit Merk Produk
          </h6>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama Merk</span>
            <input
              value={draft.name}
              onChange={(e) =>
                setDraft((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama merk"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Kode Merk</span>
            <input
              value={draft.code}
              onChange={(e) =>
                setDraft((p) => ({ ...p, code: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="kode merk"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/manage/product-category")}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark"
          >
            Simpan
          </button>
        </div>
      </div>
    </AppShell>
  );
}
