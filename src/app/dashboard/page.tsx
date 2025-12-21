import AppShell from '@/components/AppShell';
import SidebarTrigger from '@/components/SidebarTrigger';

type StatCard = {
  title: string;
  value: string;
  subtitle: string;
};

type SalesPoint = {
  day: string;
  value: number;
};

type ProductRow = {
  name: string;
  code: string;
  category: string;
  brand: string;
  qty: number;
  sellPrice: number;
  buyPrice: number;
};

export default function DashboardPage() {
  const stats: StatCard[] = [
    { title: 'Total Pemasukkan', value: 'Rp. 345,800', subtitle: '2 bulan terakhir' },
    { title: 'Total Transaksi Berhasil', value: '7', subtitle: '2 bulan terakhir' },
    { title: 'Total Stok Tersedia', value: '20', subtitle: 'Dari 3 produk, Cabang Pusat' },
    { title: 'Total Keseluruhan Stok', value: '125', subtitle: 'Dari 5 cabang' },
  ];

  const sales: SalesPoint[] = [
    { day: 'Senin', value: 160_000 },
    { day: 'Selasa', value: 190_000 },
    { day: 'Rabu', value: 90_000 },
    { day: 'Kamis', value: 140_000 },
    { day: 'Jumat', value: 210_000 },
    { day: 'Sabtu', value: 170_000 },
    { day: 'Minggu', value: 276_000 },
  ];

  const weeklyIncome = [
    { day: 'Senin', value: 200_000 },
    { day: 'Selasa', value: 230_000 },
    { day: 'Rabu', value: 120_000 },
    { day: 'Kamis', value: 180_000 },
    { day: 'Jumat', value: 250_000 },
    { day: 'Sabtu', value: 220_000 },
    { day: 'Minggu', value: 270_000 },
  ];

  const products: ProductRow[] = [
    {
      name: 'Baju Adidas',
      code: 'ADI7889',
      category: 'Pakaian',
      brand: 'Adidas',
      qty: 100,
      sellPrice: 50_000,
      buyPrice: 23_000,
    },
    {
      name: 'Batik',
      code: 'BA36777',
      category: 'Pakaian',
      brand: 'Adidas',
      qty: 400,
      sellPrice: 120_000,
      buyPrice: 43_000,
    },
  ];

  const maxSales = Math.max(...sales.map((s) => s.value));

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <img src="/filters.svg" alt="Filter" className="h-4 w-4 object-contain" />
          Filter
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.title} className="rounded-2xl bg-jax-lime px-5 py-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs opacity-90">{s.title}</div>
                <div className="mt-1 text-lg font-semibold">{s.value}</div>
                <div className="mt-1 text-[11px] opacity-90">{s.subtitle}</div>
              </div>
              <div className="rounded-xl bg-white/20 p-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </div>
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
              <div>{(276_000).toLocaleString('id-ID')}</div>
              <div>{(150_000).toLocaleString('id-ID')}</div>
              <div>{(50_000).toLocaleString('id-ID')}</div>
              <div>0</div>
            </div>

            {/* Chart */}
            <div className="flex-1">
              <div className="h-52 rounded-xl bg-white">
                <div className="h-full flex items-end justify-between gap-3">
                  {sales.map((p) => {
                    const h = Math.max(8, Math.round((p.value / maxSales) * 200));
                    return (
                      <div key={p.day} className="flex w-full flex-col items-center gap-2">
                        <div className="w-7 rounded-md bg-jax-lime" style={{ height: `${h}px` }} />
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
            {weeklyIncome.map((r) => (
              <div key={r.day} className="flex items-center justify-between">
                <div className="opacity-95">{r.day}</div>
                <div className="font-medium">Rp. {r.value.toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                <th className="px-5 py-3 font-medium">Harga Jual per satuan</th>
                <th className="px-5 py-3 font-medium">Harga Beli per satuan</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.code} className="border-b border-gray-100">
                  <td className="px-5 py-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-900">{p.name}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{p.code}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{p.category}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{p.brand}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{p.qty.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{p.sellPrice.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{p.buyPrice.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-3 text-right text-sm text-gray-500">…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
          <div>Page 1 of 1</div>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <span className="rounded border border-gray-200 bg-white px-2 py-1">20</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
