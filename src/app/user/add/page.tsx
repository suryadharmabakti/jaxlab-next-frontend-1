"use client";

import AppShell from "@/components/AppShell";
import SidebarTrigger from "@/components/SidebarTrigger";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { User } from "../page";
import { toast } from "sonner";
import { Branch } from "@/app/manage/branch/page";

export default function Page() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [draft, setDraft] = useState<User>({
    _id: "",
    name: "",
    email: "",
    cabangId: "",
    role: "Kasir",
    password: "",
  });

  const handleSave = async () => {
    const name = draft.name.trim();
    const email = draft.email.trim();
    const role = draft.role.trim();
    const cabangId = draft.cabangId;
    const password = draft.password;

    if (!name || !email || !cabangId) {
      alert("Mohon lengkapi Nama, Email, Cabang, dan Role.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOwner: user._id,
          name,
          cabangId,
          email,
          role,
          store: user.store,
          emailOwner: user.email,
          password,
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

      if (!result.ok) throw new Error("Failed to save user data.");

      toast.success("User successfully added.");
      router.push("/user");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const fetchBranchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch(`/api/branch?id=${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

      const res = await result.json();
      if (!result.ok) throw new Error(res?.error || "Failed to load data");

      setBranches(res.data ?? []);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, []);

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mb-5">
            <SidebarTrigger />
            <p className="text-xs text-gray-400">|</p>
            <div className="text-xs text-gray-400">
              Pengguna &nbsp;›&nbsp; Tambah
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <h6 className="text-md font-semibold text-gray-900 whitespace-nowrap">
            Tambah Pengguna
          </h6>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama</span>
            <input
              value={draft.name}
              onChange={(e) =>
                setDraft((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama pengguna"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Email</span>
            <input
              value={draft.email}
              onChange={(e) =>
                setDraft((p) => ({ ...p, email: e.target.value.toLowerCase() }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="email@contoh.com"
              inputMode="email"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Password</span>
            <input
              value={draft.password}
              onChange={(e) =>
                setDraft((p) => ({ ...p, password: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="***"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Cabang</span>
            <select
              value={draft.cabangId}
              onChange={(e) =>
                setDraft((p) => ({ ...p, cabangId: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih Cabang</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Role</span>
            <select
              value={draft.role}
              onChange={(e) =>
                setDraft((p) => ({ ...p, role: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
            >
              <option value="Kasir">Kasir</option>
              <option value="Gudang">Gudang</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/user")}
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
