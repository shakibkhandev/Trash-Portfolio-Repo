"use client";

import { useThemeState } from "@/context/zustand";
import { Colors } from "@/utils/Colors";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingBottomNavBar() {
  const { theme, toggleTheme } = useThemeState();

  const pathname = usePathname();

  // Check if current path is auth or admin
  const isExcludedPath =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/blogs");

  // Don't render if we're on an excluded path
  if (isExcludedPath) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 1,
      }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl border 
  backdrop-blur-md  z-50
  ${Colors[theme].background.primary} ${Colors[theme].border.primary} ${Colors[theme].shadow}`}
    >
      <nav className="flex items-center gap-4">
        {/* Home Link */}
        <div className="relative group">
          <Link
            href="/"
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out
        ${Colors[theme].text.secondary} hover:${Colors[theme].text.hover} hover:${Colors[theme].background.hover}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-800 shadow-md"
      }`}
          >
            Home
          </span>
        </div>

        {/* Blog Link */}
        <div className="relative group">
          <Link
            href="/blogs"
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out
        ${Colors[theme].text.secondary} hover:${Colors[theme].text.hover} hover:${Colors[theme].background.hover}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M8 8h8M8 12h6M8 16h4" />
            </svg>
          </Link>
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-800 shadow-md"
      }`}
          >
            Blogs
          </span>
        </div>

        {/* GitHub Link */}
        <div className="relative group">
          <a
            href="https://github.com/shakibkhandev"
            target="_blank"
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out
        ${Colors[theme].text.secondary} hover:${Colors[theme].text.hover} hover:${Colors[theme].background.hover}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-800 shadow-md"
      }`}
          >
            GitHub
          </span>
        </div>

        {/* LinkedIn Link - Add after GitHub link */}
        <div className="relative group">
          <a
            href="https://www.linkedin.com/in/shakib-khan-dev/"
            target="_blank"
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out
        ${Colors[theme].social.linkedin} hover:${Colors[theme].social.linkedinHover} hover:${Colors[theme].social.linkedinBg}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-800 shadow-md"
      }`}
          >
            LinkedIn
          </span>
        </div>

        {/* Twitter/X Link */}
        <div className="relative group">
          <a
            href="https://x.com/shakib_khan_dev"
            target="_blank"
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
        transition-all duration-300 ease-in-out
        ${Colors[theme].text.secondary} hover:${Colors[theme].text.hover} hover:${Colors[theme].background.hover}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 hover:scale-110"
            >
              <path d="M4 4l11.733 16h4.267l-11.733-16z" />
              <path d="M4 20l6.768-6.768" />
              <path d="M19.5 4h-4.267l-11.733 16h4.267l11.733-16z" />
            </svg>
          </a>
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-800 shadow-md"
      }`}
          >
            X
          </span>
        </div>

        {/* Theme Toggle Button */}
        <div className="relative group">
          <button
            onClick={() => toggleTheme()}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer
        overflow-hidden transition-all duration-300 ease-in-out
        ${Colors[theme].text.secondary} hover:${Colors[theme].text.hover} hover:${Colors[theme].background.hover}`}
            aria-label="Toggle theme"
          >
            <div className="relative z-10 transition-transform duration-500 ease-in-out">
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </div>
          </button>
          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
      ${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-800 shadow-md"
      }`}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </div>
      </nav>
    </motion.div>
  );
}
