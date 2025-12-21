"use client";

import AppShell from "@/components/AppShell";
import SidebarTrigger from "@/components/SidebarTrigger";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Branch } from "../page";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const [draft, setDraft] = useState<Branch>({
    _id: "",
    name: "",
    noTeleponAdmin: "",
    alamat: "",
  });

  const handleSave = async () => {
    const name = draft.name.trim();
    const noTeleponAdmin = draft.noTeleponAdmin.trim();
    const alamat = draft.alamat.trim();

    if (!name || !noTeleponAdmin || !alamat) {
      toast.error(
        "Mohon lengkapi: nama cabang, no telpon admin, lokasi cabang."
      );
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch("/api/branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOwner: user._id,
          name,
          noTeleponAdmin,
          alamat,
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

      if (!result.ok) throw new Error("Failed to save branch data.");

      toast.success("Branch successfully added.");
      router.push("/manage/branch");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mb-5">
            <SidebarTrigger />
            <p className="text-xs text-gray-400">|</p>
            <div className="text-xs text-gray-400">
              Kelola Cabang &nbsp;›&nbsp; Cabang &nbsp;›&nbsp; Tambah
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <h6 className="text-md font-semibold text-gray-900 whitespace-nowrap">
            Tambah Cabang
          </h6>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama Cabang</span>
            <input
              value={draft.name}
              onChange={(e) =>
                setDraft((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama cabang"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">No Telpon Admin</span>
            <input
              value={draft.noTeleponAdmin}
              onChange={(e) =>
                setDraft((p) => ({ ...p, noTeleponAdmin: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="+62..."
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Lokasi Cabang</span>
            <input
              value={draft.alamat}
              onChange={(e) =>
                setDraft((p) => ({ ...p, alamat: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="alamat / kota"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/manage/branch")}
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
