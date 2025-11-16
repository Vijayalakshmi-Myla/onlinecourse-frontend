"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token (and optionally role)
      localStorage.setItem("token", data.token);

      // Assuming backend sends role info (e.g. data.user.role)
      const userRole = data.user?.role?.toLowerCase();

      // Navigate based on user role
      switch (userRole) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "instructor":
          router.push("/dashboard/instructor");
          break;
        case "student":
          router.push("/dashboard/student");
          break;
        default:
          router.push("/dashboard"); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline font-medium">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
