"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setUser(data.session.user);
        setRole(data.session.user.user_metadata?.role || "student");
      }
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role || "student");
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          E-Learn
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>

          {user && role === "student" && (
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              My Courses
            </Link>
          )}

          {user && role === "instructor" && (
            <Link href="/instructor" className="text-gray-700 hover:text-blue-600">
              Instructor Dashboard
            </Link>
          )}

          {user && role === "admin" && (
            <Link href="/admin" className="text-gray-700 hover:text-blue-600">
              Admin Panel
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
