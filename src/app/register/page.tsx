"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    storeName: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan ulangi password tidak sama");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          store: formData.storeName,
          password: formData.password,
        }),
      });

      const res = await result.json();
      if (!result.ok) throw new Error(res.error || "Registration failed");

      toast.success("Registration successful, please log in");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="mx-auto flex w-full max-w-4xl min-h-[90vh] overflow-hidden gap-8">
        {/* Left panel */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src="/login-bg.jpg"
            alt="Register Background"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-1 items-center justify-center px-8 sm:px-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <img src="/jaxlab.png" alt="JaxLab Logo" className="h-8 w-auto" />
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold text-gray-900">
                Halo, Pengguna Baru!!
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Buat Akunmu dan kendalikan seluruh transaksi penjualanmu.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nama lengkap"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                required
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                required
              />

              <input
                name="storeName"
                type="text"
                value={formData.storeName}
                onChange={handleInputChange}
                placeholder="Nama toko"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                required
              />

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                required
              />

              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Ulangi password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-lime-500 py-2.5 text-sm font-semibold text-white hover:bg-lime-600 transition disabled:opacity-60"
              >
                {isLoading ? "Registering..." : "Sign up"}
              </button>

              <p className="pt-2 text-center text-xs text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-lime-600 hover:text-lime-700"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
