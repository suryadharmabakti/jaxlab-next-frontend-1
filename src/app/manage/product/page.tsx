"use client";

import AppShell from "@/components/AppShell";
import SidebarTrigger from "@/components/SidebarTrigger";
import TableSkeleton from "@/components/TableSkeleton";
import { includesText, cn } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Branch } from "../branch/page";
import { Brand } from "../product-brand/page";
import { Category } from "../product-category/page";

export type Product = {
  _id: string;
  name: string;
  code: string;
  file: string;
  userId: string;
};

export type Stock = {
  _id: string;
  name: string;
  code: string;
  qty: number;
  harga: number;
  hargaModal: number;
  satuan: string;
  cabangId?: string;
  produkMerkId?: string;
  produkKategoriId?: string;
  produkId?: string;
  imageDataUrl?: string;
  cabang?: Branch;
  produkMerk?: Brand;
  produkKategori?: Category;
  produk?: Product;
};

export default function Page() {
  const router = useRouter();
  const [rows, setRows] = useState<Stock[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openColumns, setOpenColumns] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, any>>({
    image: { label: "Gambar", visible: true },
    name: { label: "Nama", visible: true },
    code: { label: "Kode Produk", visible: true },
    category: { label: "Kategori Produk", visible: true },
    brand: { label: "Merk Produk", visible: true },
    qty: { label: "Qty", visible: true },
    branch: { label: "Cabang", visible: true },
    sellPrice: { label: "Harga Jual per satuan", visible: true },
    buyPrice: { label: "Harga Beli per satuan", visible: true },
  });

  const filteredRows = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const qtyText = Number.isFinite(r.qty) ? String(r.qty) : "";
      const sellText = Number.isFinite(r.harga) ? String(r.harga) : "";
      const buyText = Number.isFinite(r.hargaModal) ? String(r.hargaModal) : "";

      return (
        includesText(r.name, q) ||
        includesText(r.code, q) ||
        includesText(qtyText, q) ||
        includesText(sellText, q) ||
        includesText(buyText, q)
      );
    });
  }, [rows, filterText]);

  const actionRows = (id: string, idProduct: string) => {
    return (
      <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
        <button
          type="button"
          onClick={() => router.push(`/manage/product/${id}/edit`)}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
          )}
        >
          Edit
        </button>
        <div className="my-1 h-px bg-gray-100" />
        <button
          type="button"
          onClick={() => handleDelete(id, idProduct)}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          Hapus
        </button>
      </div>
    );
  };

  const columnRows = () => {
    return (
      <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
        <div className="px-2 py-1 text-xs text-gray-500">Tampilkan Kolom</div>

        {Object.entries(columns).map(([key, col]) => (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between px-2 py-1",
              col.locked && "opacity-60"
            )}
          >
            <span className="text-sm text-gray-700">{col.label}</span>

            <button
              disabled={col.locked}
              onClick={() =>
                setColumns((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    visible: !prev[key].visible,
                  },
                }))
              }
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                col.visible ? "bg-jax-lime" : "bg-gray-200",
                col.locked && "cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition",
                  col.visible ? "translate-x-4" : "translate-x-1"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderTableHeader = () => {
    return (
      <>
        {Object.entries(columns).map(([key, col]) =>
          col.visible ? (
            <th key={key} className="px-5 py-3 font-medium">
              {col.label}
            </th>
          ) : null
        )}

        {/* action */}
        <th className="px-5 py-3 font-medium" />
      </>
    );
  };

  const renderTableBody = () => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (!filteredRows.length) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-5 py-10 text-center text-sm text-gray-500"
          >
            No data found.
          </td>
        </tr>
      );
    }

    return filteredRows?.map((r) => (
      <tr key={r.code} className="border-b border-gray-100">
        {columns.image.visible && (
          <td className="px-5 py-3">
            <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
              {r.produk?.file ? (
                <img
                  src={r.produk.file}
                  alt={r.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200" />
              )}
            </div>
          </td>
        )}
        {columns.name.visible && (
          <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
        )}
        {columns.code.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">{r.code}</td>
        )}
        {columns.category.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">
            {r.produkKategori?.name || "-"}
          </td>
        )}
        {columns.brand.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">
            {r.produkMerk?.name || "-"}
          </td>
        )}
        {columns.qty.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">{r.qty}</td>
        )}
        {columns.branch.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">
            {r.cabang?.name || "-"}
          </td>
        )}
        {columns.sellPrice.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">
            {r.harga?.toLocaleString("id-ID")}
          </td>
        )}
        {columns.buyPrice.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">
            {r.hargaModal?.toLocaleString("id-ID")}
          </td>
        )}
        <td className="px-5 py-3 text-right">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() =>
                setOpenActionId(openActionId === r._id ? null : r._id)
              }
              className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
              aria-label="Row actions"
            >
              <span className="text-lg leading-none">…</span>
            </button>

            {openActionId === r._id && actionRows(r._id, r.produkId ?? '')}
          </div>
        </td>
      </tr>
    ));
  };

  const groupedStocks = rows.reduce<Record<string, { totalQty: number; produkCount: Set<string>; cabangName: string }>>((acc, stock) => {
    const cabangId = stock.cabang?._id || "unknown";
    if (!acc[cabangId]) {
      acc[cabangId] = { totalQty: 0, produkCount: new Set(), cabangName: stock.cabang?.name || "Unknown" };
    }
    acc[cabangId].totalQty += stock.qty;
    if (stock.produkId) acc[cabangId].produkCount.add(stock.produkId);
    return acc;
  }, {});

  const stockCards = () => {
    return (
      <div className="flex flex-wrap gap-4">
        {Object.values(groupedStocks).map((cabang) => (
          <div key={cabang.cabangName} className="mt-4 rounded-2xl bg-jax-lime px-5 py-5 text-white w-full max-w-xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs opacity-90">
                  Total Stok Tersedia
                </div>
                <div className="text-[24px] font-semibold">{cabang.totalQty}</div>
                <div className="mt-2 text-[11px] opacity-90">
                  Dari {cabang.produkCount.size} produk, Cabang {cabang.cabangName}
                </div>
              </div>
              <div className="rounded-xl">
                <img src="/manage.svg" alt="icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch(`/api/stock?id=${user._id}`, {
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

      setRows(res.data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string, idProduct: string) => {
    toast("Yakin ingin menghapus data ini?", {
      description: "Data yang dihapus tidak dapat dikembalikan.",
      duration: Infinity,
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            await fetch(`/api/stock/${id}?idProduct=${idProduct}`, {
              method: "DELETE",
            });

            toast.success("Data successfully deleted");
            fetchData();
          } catch (err) {
            toast.error("Failed to delete data");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <SidebarTrigger />
              <p className="text-xs text-gray-400">|</p>
              <div className="text-xs text-gray-400">
                Kelola Barang &nbsp;›&nbsp; Barang/Produk
              </div>
            </div>
            <h1 className="mt-1 text-xl font-semibold text-gray-900">
              Barang/Produk
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <img
              src="/filters.svg"
              alt="Filter"
              className="h-4 w-4 object-contain"
            />
            Filter
          </button>
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpenColumns((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <img
                src="/kolom.png"
                alt="Kolom"
                className="h-4 w-4 object-contain"
              />
              Kolom
            </button>
            {openColumns && columnRows()}
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 w-24 shrink-0">Cari</div>
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama / kode / kategori / merk / cabang"
            />
            <button
              type="button"
              onClick={() => setFilterText("")}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => router.push("/manage/product/add")}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <span className="text-base leading-none">+</span> Tambah
        </button>
        {/* <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx, .xls"
        /> */}
        <button
          onClick={() => {}}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"
            />
          </svg>
          Import
        </button>
        <button
          onClick={() => {}}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 21V9m0 0l4 4m-4-4l-4 4M4 7V4h16v3"
            />
          </svg>
          Export
        </button>
      </div>

      {/* Display Stat Stock */}
      {stockCards()}

      <div className="mt-4 rounded-2xl bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-[11px] text-gray-500">
                {renderTableHeader()}
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
          <div>
            Page {filteredRows?.length} dari {rows?.length}
          </div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">
              20
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
