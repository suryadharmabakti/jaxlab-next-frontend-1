"use client";

import { Branch } from "@/app/manage/branch/page";
import { Brand } from "@/app/manage/product-brand/page";
import { Category } from "@/app/manage/product-category/page";
import AppShell from "@/components/AppShell";
import SidebarTrigger from "@/components/SidebarTrigger";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stock } from "../../page";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.slug as string;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<Stock>({
    _id: "",
    name: "",
    code: "",
    qty: 0,
    harga: 0,
    hargaModal: 0,
    satuan: "",
    cabangId: "",
    produkId: "",
    produkKategoriId: "",
    produkMerkId: "",
    imageDataUrl: "",
  });
  const SATUAN_OPTIONS = ["pcs", "g", "kg", "ons", "liter", "karung"];

  const handleSave = async () => {
    const name = draft.name.trim();
    const code = draft.code.trim();
    const cabangId = draft.cabangId;
    const produkKategoriId = draft.produkKategoriId;
    const produkMerkId = draft.produkMerkId;
    const satuan = draft.satuan;
    const qty = Number(draft.qty);
    const harga = Number(draft.harga);
    const hargaModal = Number(draft.hargaModal);
    const image = draft.imageDataUrl;

    if (
      !name ||
      !code ||
      !cabangId ||
      !produkKategoriId ||
      !produkMerkId ||
      !satuan
    ) {
      alert(
        "Mohon lengkapi: Nama, Kode Produk, Cabang, Kategori, Merk, dan Satuan."
      );
      return;
    }

    if (qty <= 0) {
      alert("Qty harus lebih dari 0.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch("/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOwner: user._id,
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

      if (!result.ok) throw new Error("Failed to save product data.");

      toast.success("Stock product successfully added.");
      router.push("/manage/product");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handlePickImage = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDraft((p) => ({
        ...p,
        imageDataUrl: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
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

  const fetchCategoryData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch(`/api/product-category?id=${user._id}`, {
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

      setCategories(res.data ?? []);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const fetchBrandData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch(`/api/product-brand?id=${user._id}`, {
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

      setBrands(res.data ?? []);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const fetchById = async () => {
    try {
      const res = await fetch(`/api/stock/${id}`);

      if (!res.ok) throw new Error("Failed to retrieve product brand data");

      const data = await res.json();

      setDraft({
        _id: data.data._id ?? "",
        name: data.data.name ?? "",
        code: data.data.code ?? "",
        qty: Number(data.data.qty ?? 0),
        harga: Number(data.data.harga ?? 0),
        hargaModal: Number(data.data.hargaModal ?? 0),
        satuan: data.data.satuan ?? "",
        cabangId: data.data.cabangId ?? "",
        produkKategoriId: data.data.produkKategoriId ?? "",
        produkMerkId: data.data.produkMerkId ?? "",
        imageDataUrl: data.data.image ?? "",
      });
    
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  useEffect(() => {
    fetchBranchData();
    fetchBrandData();
    fetchCategoryData();
  }, []);

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
              Kelola Barang &nbsp;›&nbsp; Barang/Produk &nbsp;›&nbsp; Edit
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <h6 className="text-md font-semibold text-gray-900 whitespace-nowrap">
            Edit Barang/Produk
          </h6>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Gambar Produk</span>

            <div className="flex-1 flex items-center gap-4">
              {draft.imageDataUrl ? (
                <img
                  src={draft.imageDataUrl}
                  alt="preview"
                  className="h-20 w-20 rounded-2xl object-cover border border-gray-200"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                  Preview
                </div>
              )}

              <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Pilih Gambar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePickImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Nama</span>
            <input
              value={draft.name}
              onChange={(e) =>
                setDraft((p) => ({ ...p, name: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama produk"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Kode Produk</span>
            <input
              value={draft.code}
              onChange={(e) =>
                setDraft((p) => ({ ...p, code: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="kode produk"
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
            <span className="w-48 text-xs text-gray-600">Kategori</span>
            <select
              value={draft.produkKategoriId}
              onChange={(e) =>
                setDraft((p) => ({ ...p, produkKategoriId: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih Produk Kategori</option>
              {categories.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Merk</span>
            <select
              value={draft.produkMerkId}
              onChange={(e) =>
                setDraft((p) => ({ ...p, produkMerkId: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih Produk Merk</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Qty</span>
            <input
              value={draft.qty}
              onChange={(e) =>
                setDraft((p) => ({ ...p, qty: Number(e.target.value) }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">
              Harga Jual per satuan
            </span>
            <input
              value={draft.harga}
              onChange={(e) =>
                setDraft((p) => ({ ...p, harga: Number(e.target.value) }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">
              Harga Beli per satuan
            </span>
            <input
              value={draft.hargaModal}
              onChange={(e) =>
                setDraft((p) => ({ ...p, hargaModal: Number(e.target.value) }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="w-48 text-xs text-gray-600">Satuan</span>
            <select
              value={draft.satuan}
              onChange={(e) =>
                setDraft((p) => ({ ...p, satuan: e.target.value }))
              }
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih Satuan</option>
              {SATUAN_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/manage/product")}
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
