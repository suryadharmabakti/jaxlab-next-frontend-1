 "use client";
import AppShell from '@/components/AppShell';
import SidebarTrigger from '@/components/SidebarTrigger';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Stock } from '../manage/product/page';

type StatCard = {
  title: string;
  value: string;
  subtitle: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const stats: StatCard[] = [
    { title: 'Total Pemasukkan', value: 'Rp. 345,800', subtitle: '2 bulan terakhir' },
    { title: 'Total Transaksi Berhasil', value: '7', subtitle: '2 bulan terakhir' },
    { title: 'Total Stok Tersedia', value: '20', subtitle: 'Dari 3 produk, Cabang Pusat' },
    { title: 'Total Keseluruhan Stok', value: '125', subtitle: 'Dari 5 cabang' },
  ];

  const [products, setProducts] = useState<Stock[]>([]);
  const [dashboard, setDashboard] = useState<any>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchDashboard = async () => {
    setIsLoadingDashboard(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const result = await fetch(`/api/dashboard?id=${user._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (result.status === 401) {
        toast.error('Your session has ended. Please log in again.');
        await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        localStorage.removeItem('user');
        router.replace('/login');
        return;
      }

      const res = await result.json();
      if (!result.ok) throw new Error(res?.error || 'Failed to load data');
      
      const data = res.data;

      stats[0].value = `${data.totalPemasukan2Bulan}` || '0';
      stats[1].value = `${data.totalTransaksi2Bulan}` || '0';
      stats[2].value = `${data.totalStokCabangPusat}` || '0';
      stats[3].value = `${data.totalStok}` || '0';

      setDashboard(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const result = await fetch(`/api/stock?id=${user._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (result.status === 401) {
        toast.error('Your session has ended. Please log in again.');
        await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        localStorage.removeItem('user');
        router.replace('/login');
        return;
      }

      const res = await result.json();
      if (!result.ok) throw new Error(res?.error || 'Failed to load data');

      setProducts(res.data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchProducts();
  }, [router]);

  const maxSales = Math.max(
    ...(dashboard?.pendapatanPerHari?.map((s: any) => s.total) ?? [0])
  );

  const yAxisValues = [
    maxSales,
    Math.round(maxSales * 0.66),
    Math.round(maxSales * 0.33),
    0,
  ];

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mb-5">
            <SidebarTrigger />
            <p className="text-xs text-gray-400">|</p>
            <div className="text-xs text-gray-400">
              Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="mt-1 text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {}}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <img
              src="/filters.svg"
              alt="Filter"
              className="h-4 w-4 object-contain"
            />
            Filter
          </button>
        </div>
      </div>

      {isLoadingDashboard ? (
        <div className="flex w-full items-center justify-center text-sm text-gray-400">
          Memuat data…
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.title} className="rounded-2xl bg-jax-lime px-5 py-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs opacity-90">{s.title}</div>
                    <div className="mt-1 text-lg font-semibold">{s.value}</div>
                    <div className="mt-1 text-[11px] opacity-90">{s.subtitle}</div>
                  </div>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Ringkasan Penjualan */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-5">
              <div className="text-sm font-semibold text-gray-900">Ringkasan Penjualan</div>

              <div className="mt-4 flex">
                {/* Y axis */}
                <div className="pr-4 text-[11px] text-gray-400 flex flex-col justify-between h-52">
                  {yAxisValues.map((v, i) => (
                    <div key={i}>
                      {v.toLocaleString("id-ID")}
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="flex-1">
                  <div className="h-52 rounded-xl bg-white">
                    <div className="h-full flex items-end justify-between gap-3">
                      {(dashboard?.pendapatanPerHari ?? []).map((p: any) => {
                        const ratio = maxSales > 0 ? p.total / maxSales : 0;
                        const h = Math.max(8, Math.round(ratio * 200));
                      
                        return (
                          <div key={p.day} className="flex w-full flex-col items-center gap-2">
                            <div
                              className="w-7 rounded-md bg-jax-lime transition-all"
                              style={{ height: `${h}px` }}
                            />
                            <div className="text-[11px] text-gray-500">{p.day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pendapatan per Minggu */}
            <div className="rounded-2xl bg-jax-lime p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">Pendapatan per Minggu</div>
                </div>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
                </svg> 
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {(dashboard?.pendapatanPerHari ?? []).map((r: any) => (
                  <>
                    <div key={r.day} className="flex items-center justify-between">
                      <div className="opacity-95">{r.day}</div>
                      <div className="font-medium">
                        Rp {Number(r.total || 0).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <hr className="opacity-50"/>
                  </>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pengelolaan Barang Cabang */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-200">
        <div className="px-5 pt-5 text-sm font-semibold text-gray-900">Pengelolaan Barang Cabang</div>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-[11px] text-gray-500">
                <th className="px-5 py-3 font-medium">Gambar</th>
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Kode Produk</th>
                <th className="px-5 py-3 font-medium">Kategori Produk</th>
                <th className="px-5 py-3 font-medium">Merk Produk</th>
                <th className="px-5 py-3 font-medium">Qty</th>
                <th className="px-5 py-3 font-medium">Cabang</th>
                <th className="px-5 py-3 font-medium">Harga Jual per satuan</th>
                <th className="px-5 py-3 font-medium">Harga Beli per satuan</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProducts ? (
                <tr>
                  <td colSpan={9} className="px-5 py-6 text-center text-sm text-gray-500">Memuat data…</td>
                </tr>
              ) : !products.length ? (
                <tr>
                  <td colSpan={9} className="px-5 py-6 text-center text-sm text-gray-500">Belum ada data produk</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.code} className="border-b border-gray-100">
                    <td className="px-5 py-3">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                        {p.produk?.file ? (
                          <img
                            src={p.produk.file}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-900">{p.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.code}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.produkKategori?.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.produkMerk?.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.qty}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.cabang?.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.harga.toLocaleString('id-ID')}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.hargaModal.toLocaleString('id-ID')}</td>
                    <td className="px-5 py-3 text-right text-sm text-gray-500">…</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
          <div>Menampilkan {products.length} produk</div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">20</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
