"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSidebar } from "@/components/AppShell";
import { toast } from "sonner";

type NavItem =
  | {
      key: string;
      label: string;
      href: string;
      icon: ReactNode;
    }
  | {
      key: string;
      label: string;
      icon: ReactNode;
      children: { key: string; label: string; href: string }[];
    };

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function LineIcon() {
  return <span className="inline-block h-5 w-[2px] rounded bg-black" />;
}

export default function Sidebar() {
  const { isSidebarOpen: open } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const isKelolaBarangActive = pathname.startsWith("/manage");
  const [isKelolaBarangOpen, setIsKelolaBarangOpen] =
    useState(isKelolaBarangActive);

  useEffect(() => {
    if (isKelolaBarangActive) setIsKelolaBarangOpen(true);
  }, [isKelolaBarangActive]);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        key: "beranda",
        label: "Beranda",
        href: "/dashboard",
        icon: (
          <img
            src="/beranda.svg"
            alt="Beranda"
            className="h-5 w-5 object-contain"
          />
        ),
      },
      {
        key: "kelola-barang",
        label: "Kelola Barang",
        icon: (
          <img
            src="/manage.svg"
            alt="Kelola Barang"
            className="h-5 w-5 object-contain"
          />
        ),
        children: [
          { key: "cabang", label: "Cabang", href: "/manage/branch" },
          {
            key: "kategori",
            label: "Kategori Produk",
            href: "/manage/product-category",
          },
          { key: "merk", label: "Merk Produk", href: "/manage/product-brand" },
          { key: "barang", label: "Barang/Produk", href: "/manage/product" },
        ],
      },
      {
        key: "pengguna",
        label: "Pengguna",
        href: "/user",
        icon: (
          <img
            src="/pengguna.svg"
            alt="Pengguna"
            className="h-5 w-5 object-contain"
          />
        ),
      },
      {
        key: "laporan",
        label: "Laporan",
        href: "/report",
        icon: (
          <img
            src="/laporan.svg"
            alt="Laporan"
            className="h-5 w-5 object-contain"
          />
        ),
      },
    ],
    []
  );

  const handleLogout = () => {
    toast("Yakin ingin keluar?", {
      description: "Sesi kamu akan langsung diakhiri",
      duration: Infinity,
      action: {
        label: "Keluar",
        onClick: async () => {
          await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
          });
          localStorage.removeItem("user");
          router.replace("/login");
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {}
      },
    });
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-jax-line bg-white transition-all duration-400",
        open ? "w-72" : "w-20"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between py-6",
          open ? "px-6" : "px-3"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            open ? "gap-2" : "justify-center w-full"
          )}
        >
          <img
            src={open ? "/jaxlab.png" : "/jaxer.png"}
            alt={open ? "JaxLab" : "Jaxer"}
            className={cn(
              open
                ? "h-10 w-auto"
                : "h-12 w-12 rounded-lg bg-white p-1 object-contain"
            )}
          />
        </div>
      </div>

      {open && <div className="px-6 pb-2 text-xs text-gray-400">Highlight</div>}

      <nav className={cn("flex-1", open ? "px-4" : "px-2")}>
        <div className="space-y-1">
          {navItems.map((item) => {
            if ("children" in item) {
              const anyChildActive = item.children.some((c) =>
                pathname.startsWith(c.href)
              );

              return (
                <div key={item.key}>
                  <button
                    type="button"
                    onClick={() => setIsKelolaBarangOpen((v) => !v)}
                    className={cn(
                      "w-full flex items-center rounded-xl py-3 text-sm transition",
                      open ? "justify-between px-3" : "justify-center",
                      anyChildActive
                        ? "bg-jax-lime text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span
                      className={cn("flex items-center", open ? "gap-3" : "")}
                    >
                      <span
                        className={cn(
                          "transition",
                          anyChildActive
                            ? "brightness-0 invert"
                            : "brightness-0"
                        )}
                      >
                        {item.icon}
                      </span>

                      {open && (
                        <span
                          className={cn(
                            "font-medium",
                            anyChildActive ? "text-white" : "text-gray-800"
                          )}
                        >
                          {item.label}
                        </span>
                      )}
                    </span>

                    {open && (
                      <svg
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isKelolaBarangOpen ? "rotate-180" : "rotate-0",
                          anyChildActive ? "text-white" : "text-gray-500"
                        )}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {isKelolaBarangOpen && open && (
                    <div className="relative mt-2 ml-6">
                      <span className="absolute left-0 top-0 h-full w-[1px] bg-gray-300" />

                      <div className="space-y-1 pl-4">
                        {item.children.map((c) => {
                          const active = pathname === c.href;
                          return (
                            <Link
                              key={c.key}
                              href={c.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                                active
                                  ? "text-jax-limeDark"
                                  : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <span
                                className={cn(
                                  "font-medium",
                                  active && "text-jax-limeDark"
                                )}
                              >
                                {c.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl py-3 text-sm transition",
                  open ? "gap-3 px-3" : "justify-center",
                  active
                    ? "bg-jax-lime text-white"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "transition",
                    active ? "brightness-0 invert" : "brightness-0"
                  )}
                >
                  {item.icon}
                </span>

                {open && (
                  <span
                    className={cn(
                      "font-medium",
                      active ? "text-white" : "text-gray-800"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl border border-red-300 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {open && "Keluar"}
        </button>
      </div>
    </aside>
  );
}
