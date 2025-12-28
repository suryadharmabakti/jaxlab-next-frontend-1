"use client";

import AppShell from "@/components/AppShell";
import SidebarTrigger from "@/components/SidebarTrigger";
import { useRouter } from "next/navigation";
import { Branch } from "../manage/branch/page";
import { useEffect, useMemo, useState } from "react";
import { includesText, cn, rolePillClass, exportToExcel } from "@/utils/helper";
import TableSkeleton from "@/components/TableSkeleton";
import { toast } from "sonner";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  cabangId?: string;
  password?: string;
  branch?: Branch;
};

export default function Page() {
  const router = useRouter();
  const [rows, setRows] = useState<User[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openColumns, setOpenColumns] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [openImport, setOpenImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [columns, setColumns] = useState<Record<string, any>>({
    name: { label: "Nama", visible: true },
    email: { label: "Email", visible: true },
    branch: { label: "Cabang", visible: true },
    role: { label: "Role", visible: true },
  });

  const filteredRows = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r: any) =>
        includesText(r.name, q) ||
        includesText(r.email, q) ||
        includesText(r.branch.name, q) ||
        includesText(r.role.toLowerCase(), q)
    );
  }, [rows, filterText]);

  const actionRows = (id: string) => {
    return (
      <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
        <button
          type="button"
          onClick={() => router.push(`/user/${id}/edit`)}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
          )}
        >
          Edit
        </button>
        <div className="my-1 h-px bg-gray-100" />
        <button
          type="button"
          onClick={() => handleDelete(id)}
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

    return filteredRows.map((r) => (
      <tr key={r._id} className="border-b border-gray-100">
        {columns.name.visible && (
          <td className="px-5 py-3 text-sm text-gray-900">{r.name}</td>
        )}
        {columns.email.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">{r.email}</td>
        )}
        {columns.branch.visible && (
          <td className="px-5 py-3 text-sm text-gray-700">{r.branch?.name}</td>
        )}
        {columns.role.visible && (
          <td className="px-5 py-3 text-sm">
            <span className={rolePillClass(r.role.toLowerCase())}>
              {r.role.charAt(0).toUpperCase() + r.role.slice(1)}
            </span>
          </td>
        )}
        <td className="px-5 py-3 text-right">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setOpenActionId(openActionId === r._id ? null : r._id)}
              className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
              aria-label="Row actions"
            >
              <span className="text-lg leading-none">…</span>
            </button>

            {openActionId === r._id && actionRows(r._id)}
          </div>
        </td>
      </tr>
    ));
  };

  const renderModalImport = () => {
    if (!openImport) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Import Pengguna (Karyawan)
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Unduh template lalu unggah file Excel yang sudah diisi.
          </p>

          {/* Download template */}
          <a
            href="/template_user.xlsx"
            download
            className="mt-4 inline-block text-sm font-medium text-jax-lime hover:underline"
          >
            ⬇ Download Template Excel
          </a>

          {/* File input */}
          <div className="mt-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) =>
                setImportFile(e.target.files?.[0] || null)
              }
              className="block w-full text-sm text-gray-700"
            />
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setOpenImport(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            >
              Batal
            </button>

            <button
              disabled={!importFile || isImporting}
              onClick={handleImport}
              className="rounded-lg bg-jax-lime px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isImporting ? "Mengimpor..." : "Import"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      setIsImporting(true);

      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("idOwner", user._id);

      const res = await fetch("/api/user/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import gagal");
      }

      toast.success("Import berhasil");
      setOpenImport(false);
      setImportFile(null);
      fetchData();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    const visibleCols = Object.entries(columns).filter(([, col]) => col.visible);
    const headers = visibleCols.map(([, col]) => col.label);
    const data = filteredRows.map((r) =>
      visibleCols.map(([key]) => {
        if (key === "name") return r.name;
        if (key === "email") return r.email;
        if (key === "branch") return r.branch?.name || "-";
        if (key === "role") return r.role;
        return "";
      })
    );
    exportToExcel("pengguna", headers, data);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const result = await fetch(
        `/api/user?id=${user._id}&email=${user.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

      setRows(res.data ?? []);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast("Yakin ingin menghapus data ini?", {
      description: "Data yang dihapus tidak dapat dikembalikan.",
      duration: Infinity,
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            await fetch(`/api/user/${id}`, {
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
          <div className="flex items-center gap-3 mb-5">
            <SidebarTrigger />
            <p className="text-xs text-gray-400">|</p>
            <div className="text-xs text-gray-400">Pengguna</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="mt-1 text-xl font-semibold text-gray-900">Pengguna</h1>
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
        <div className="mt-4 w-full max-w-2xl rounded-2xl bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600 w-24 shrink-0">Cari</div>
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
              placeholder="nama / email / cabang / role"
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
          onClick={() => router.push("/user/add")}
          className="inline-flex items-center gap-2 rounded-lg bg-jax-lime px-3 py-2 text-sm font-medium text-white hover:bg-jax-limeDark transition"
        >
          <span className="text-base leading-none">+</span> Tambah
        </button>
        <button
          onClick={() => setOpenImport(true)}
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
          onClick={handleExport}
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
          <div>Page {filteredRows.length} of {rows.length}</div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">
              20
            </span>
          </div>
        </div>
      </div>

      {renderModalImport()}
    </AppShell>
  );
}
