"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface NewsletterResponse {
  newsletters: Newsletter[];
  pagination: Pagination;
  links: {
    self: string;
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}

export default function NewsletterTab() {
  const { isDarkMode } = useGlobalContext();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const accessToken = Cookies.get("access_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/newsletter?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data: NewsletterResponse = response.data.data;
      setNewsletters(data.newsletters);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch newsletters");
      console.error("Error fetching newsletters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    try {
      const accessToken = Cookies.get("access_token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/newsletter/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Newsletter subscription deleted successfully");
      fetchNewsletters();
    } catch (error) {
      toast.error("Failed to delete newsletter subscription");
      console.error("Error deleting newsletter:", error);
    }
  };

  const filteredNewsletters = newsletters.filter((newsletter) =>
    newsletter.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = newsletters
      .map((newsletter) => newsletter.email)
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <FiMail
              className={`w-6 h-6 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Newsletter Subscribers
            </h2>
            <p className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Manage your newsletter subscribers
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            isDarkMode
              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
          } transition-colors duration-200`}
        >
          <FiDownload className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FiSearch
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 rounded-xl ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
          } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200`}
        />
      </div>

      {/* Newsletter List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className={`text-center py-12 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            No subscribers found
          </div>
        ) : (
          <AnimatePresence>
            {filteredNewsletters.map((newsletter) => (
              <motion.div
                key={newsletter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-xl ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white border-gray-200"
                } border shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <FiMail
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {newsletter.email}
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Subscribed on{" "}
                        {new Date(newsletter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(newsletter.id)}
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? "hover:bg-red-500/20 text-red-400"
                        : "hover:bg-red-500/10 text-red-500"
                    } transition-colors duration-200`}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            } transition-colors duration-200`}
          >
            Previous
          </button>
          <span className={`px-4 py-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))
            }
            disabled={currentPage === pagination.totalPages}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            } transition-colors duration-200`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 