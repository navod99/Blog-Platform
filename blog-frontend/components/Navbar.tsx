"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/app/actions/auth";
import toast from "react-hot-toast";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout: clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section: Logo + Links */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              {/* Logo Icon */}
              <div className="p-2 rounded-xl bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors">
                <FiBookOpen className="h-6 w-6" />
              </div>

              {/* Brand Name */}
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                Blogify
              </span>
            </Link>
            <div className="hidden sm:ml-16 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="relative text-gray-700 text-base font-medium hover:text-primary-600 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/posts/new"
                    className="relative text-gray-700 text-base font-medium hover:text-primary-600 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary-600 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Write
                  </Link>
                  <Link
                    href="/dashboard"
                    className="relative text-gray-700 text-base font-medium hover:text-primary-600 transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary-600 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Section: Auth Links */}
          <div className="hidden sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hi, {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-primary-600 border border-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-transform transform hover:scale-105"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? (
                <HiOutlineX className="h-6 w-6" />
              ) : (
                <HiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white shadow-inner">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:text-primary-600 text-base font-medium transition-colors"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/posts/new"
                  className="block px-4 py-2 text-gray-700 hover:text-primary-600 text-base font-medium transition-colors"
                >
                  Write
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:text-primary-600 text-base font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-primary-600 text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:text-primary-600 text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-gray-700 hover:text-primary-600 text-base font-medium transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
