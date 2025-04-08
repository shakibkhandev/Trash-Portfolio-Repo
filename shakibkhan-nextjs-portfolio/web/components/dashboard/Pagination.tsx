"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContextProvider";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPreviousPage,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  const { isDarkMode } = useGlobalContext();

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
            currentPage === i
              ? isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-900"
              : isDarkMode
                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </motion.button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
          hasPreviousPage
            ? isDarkMode
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            : isDarkMode
              ? "text-gray-700/30 cursor-not-allowed"
              : "text-gray-300 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
          hasNextPage
            ? isDarkMode
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            : isDarkMode
              ? "text-gray-700/30 cursor-not-allowed"
              : "text-gray-300 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
