'use client';

import AppShell from '@/components/AppShell';
import { type ProductRow, loadProducts, saveProducts } from '@/app/manage/product/productStore';
import { DEFAULT_BRANCHES, branchNames, loadBranches } from '@/app/manage/branch/branchStore';
import { DEFAULT_CATEGORIES, categoryNames, loadCategories } from '@/app/manage/product-category/categoryStore';
import { DEFAULT_BRANDS, brandNames, loadBrands } from '@/app/manage/product-brand/brandStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function EditProdukPage() {
  const router = useRouter();
  const params = useParams();
  const code = (params?.code as string) ?? '';

  const [branches, setBranches] = useState<string[]>(() => branchNames(DEFAULT_BRANCHES));
  const [categories, setCategories] = useState<string[]>(() => categoryNames(DEFAULT_CATEGORIES));
  const [brands, setBrands] = useState<string[]>(() => brandNames(DEFAULT_BRANDS));

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [draft, setDraft] = useState({
    imageDataUrl: '' as string,
    name: '',
    code: '',
    category: '' as string,
    brand: '' as string,
    qty: '',
    branch: '' as string,
    sellPrice: '',
    buyPrice: '',
  });

  // Ensure we show current value even if it's not in the master list.
  const branchOptions = useMemo(() => Array.from(new Set([draft.branch, ...branches].filter(Boolean))), [draft.branch, branches]);
  const categoryOptions = useMemo(() => Array.from(new Set([draft.category, ...categories].filter(Boolean))), [draft.category, categories]);
  const brandOptions = useMemo(() => Array.from(new Set([draft.brand, ...brands].filter(Boolean))), [draft.brand, brands]);

  useEffect(() => {
    // Load latest options from localStorage on the client.
    setBranches(branchNames(loadBranches()));
    setCategories(categoryNames(loadCategories()));
    setBrands(brandNames(loadBrands()));

    const products = loadProducts();
    const found = products.find((p) => p.code === code) ?? null;
    setProduct(found);

    if (found) {
      setDraft({
        imageDataUrl: found.imageDataUrl ?? '',
        name: found.name,
        code: found.code,
        category: found.category,
        brand: found.brand,
        qty: String(found.qty ?? ''),
        branch: found.branch,
        sellPrice: String(found.sellPrice ?? ''),
        buyPrice: String(found.buyPrice ?? ''),
      });
    }

    setLoading(false);
  }, [code]);

  const handlePickImage = (file: File | null) => {
    if (!file) {
      setDraft((p) => ({ ...p, imageDataUrl: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraft((p) => ({ ...p, imageDataUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const name = draft.name.trim();
    const category = draft.category.trim();
    const brand = draft.brand.trim();
    const branch = draft.branch.trim();
    const qty = Number(draft.qty);
    const sellPrice = Number(draft.sellPrice);
    const buyPrice = Number(draft.buyPrice);

    if (!name || !code || !category || !brand || !branch) {
      alert('Mohon lengkapi: nama, kategori, merk, cabang.');
      return;
    }

    if (!Number.isFinite(qty) || qty < 0) {
      alert('Qty harus angka yang valid.');
      return;
    }

    if (!Number.isFinite(sellPrice) || sellPrice < 0) {
      alert('Harga jual harus angka yang valid.');
      return;
    }

    if (!Number.isFinite(buyPrice) || buyPrice < 0) {
      alert('Harga beli harus angka yang valid.');
      return;
    }

    const products = loadProducts();
    const next = products.map((p) =>
      p.code === code
        ? {
            ...p,
            imageDataUrl: draft.imageDataUrl || undefined,
            name,
            category,
            brand,
            qty,
            branch,
            sellPrice,
            buyPrice,
          }
        : p
    );

    saveProducts(next);
    router.push('/manage/barang-produk');
  };

  const handleDelete = () => {
    if (!product) return;
    if (!confirm(`Hapus produk: ${product.name}?`)) return;

    const products = loadProducts();
    saveProducts(products.filter((p) => p.code !== code));
    router.push('/manage/barang-produk');
  };

  return (
    <AppShell>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-400">Kelola Barang &nbsp;›&nbsp; Barang/Produk</div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Edit Produk</h1>
        </div>
      </div>

      <div className="mt-4 w-full max-w-3xl rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        {loading ? (
          <div className="text-sm text-gray-600">Memuat…</div>
        ) : !product ? (
          <div className="text-sm text-gray-600">
            Produk tidak ditemukan.
            <button
              type="button"
              onClick={() => router.push('/manage/barang-produk')}
              className="ml-2 underline text-jax-limeDark"
            >
              Kembali
            </button>
          </div>
        ) : (
          <>
            <div className="mt-1 text-xs text-gray-500">Kode produk: {product.code}</div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="grid gap-1">
                  <span className="text-xs text-gray-600">Gambar Produk</span>
                  <div className="flex items-center gap-3">
                    {draft.imageDataUrl ? (
                      <img
                        src={draft.imageDataUrl}
                        alt="preview"
                        className="h-12 w-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePickImage(e.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-gray-700"
                    />
                  </div>
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Nama</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="nama produk"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Kode Produk</span>
                <input
                  value={draft.code}
                  disabled
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Kategori</span>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Merk</span>
                <select
                  value={draft.brand}
                  onChange={(e) => setDraft((p) => ({ ...p, brand: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                >
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Qty</span>
                <input
                  value={draft.qty}
                  onChange={(e) => setDraft((p) => ({ ...p, qty: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="0"
                  inputMode="numeric"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Cabang</span>
                <select
                  value={draft.branch}
                  onChange={(e) => setDraft((p) => ({ ...p, branch: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                >
                  {branchOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Harga Jual per satuan</span>
                <input
                  value={draft.sellPrice}
                  onChange={(e) => setDraft((p) => ({ ...p, sellPrice: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="0"
                  inputMode="numeric"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-gray-600">Harga Beli per satuan</span>
                <input
                  value={draft.buyPrice}
                  onChange={(e) => setDraft((p) => ({ ...p, buyPrice: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-jax-lime"
                  placeholder="0"
                  inputMode="numeric"
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/manage/barang-produk')}
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
          </>
        )}
      </div>
    </AppShell>
  );
}
