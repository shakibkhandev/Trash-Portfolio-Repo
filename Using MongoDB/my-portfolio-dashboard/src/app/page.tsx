"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LoginResponse {
  statusCode: number;
  data: {
    access_token: string;
  };
  message: string;
  success: boolean;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed");
      }

      // Save token in cookies (expires in 24 hours)
      Cookies.set("access_token", data.data.access_token, {
        expires: 1, // 1 day
        secure: process.env.NEXT_PUBLIC_NODE_ENV === "production", // Use secure in production
        sameSite: "strict",
      });

      // Show success toast
      toast.success(data.message || "Access granted! Welcome to Admin Panel", {
        duration: 2000,
      });

      router.push("/dashboard")

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect to server";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-[400px]  p-8 rounded-2xl">

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-semibold text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-500 text-[15px]">
            Enter your administrator credentials
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-[14px]">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Administrator Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                         transition-colors duration-200
                         focus:outline-none focus:border-blue-500 focus:bg-white"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-[14px] font-medium text-gray-700 mb-2"
              >
                Administrator Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                         transition-colors duration-200
                         focus:outline-none focus:border-blue-500 focus:bg-white"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gray-900 text-white rounded-xl font-medium
                     transition-all duration-200
                     hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20
                     active:transform active:scale-[0.99]
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Access Admin Panel"}
          </button>

          {/* Contact Support Link */}
          <div className="text-center">
            <a
              href="#"
              className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Contact System Administrator
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
