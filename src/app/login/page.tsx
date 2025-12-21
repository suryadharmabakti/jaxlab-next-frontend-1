"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const res = await result.json();
      if (!result.ok) throw new Error(res.error || "Email atau password salah");

      const data = res.data;

      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        store: data.store,
      };

      localStorage.setItem("user", JSON.stringify(user));

      router.push("/dashboard");
      toast.success("Login successfully");
    } catch (error: any) {
      setError(error.message || "Email atau password salah");
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
            alt="Login Background"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-1 items-center justify-center px-8 sm:px-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-16">
              <img src="/jaxlab.png" alt="JaxLab Logo" className="h-8 w-auto" />
            </div>

            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-semibold text-gray-900">Welcome,</h1>
              <p className="mt-2 text-sm text-gray-600">
                Kendalikan seluruh transaksi penjualanmu hanya dengan satu klik
                saja.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 outline-none"
                placeholder="username / email"
                autoComplete="username"
                required
              />

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 outline-none"
                placeholder="password"
                autoComplete="current-password"
                required
              />

              <label className="flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-lime-500 py-2.5 text-sm font-semibold text-white hover:bg-lime-600 transition disabled:opacity-60"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>

              <p className="pt-2 text-center text-xs text-gray-600">
                Baru pertama kali pakai App?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-lime-600 hover:text-lime-700"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
