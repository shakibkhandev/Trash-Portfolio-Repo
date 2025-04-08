"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { motion } from "framer-motion";
import { Plus, Edit3, Eye, EyeOff, PenSquare, Trash2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import Pagination from "../Pagination";
import Image from "next/image";
import { format } from "date-fns";


interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string;
  createdAt: string;
  readingTime: number;
  isHidden: boolean;
  tags: { id: string; label: string; }[];
}

interface PaginationLinks {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  self: string;
  first: string;
  prev: string | null;
  next: string | null;
  last: string;
}

interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalBlogs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function BlogsTab() {
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [paginationLinks, setPaginationLinks] = useState<PaginationLinks | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs?page=${currentPage}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      setBlogs(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPaginationLinks(response.data.links);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlog = (blogId: string) => {
    router.push(`/admin/dashboard/blog/edit/${blogId}`);
  };

  const handleDeleteBlog = (blogId: string) => {
    setSelectedBlog(blogId);
    setIsDeleteModalOpen(true);
  };

  const handleToggleVisibility = async (blogId: string, currentlyHidden: boolean) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${currentlyHidden ? 'unhide' : 'hide'}/${blogId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      
      setBlogs(blogs.map(blog => 
        blog.id === blogId 
          ? { ...blog, isHidden: !currentlyHidden }
          : blog
      ));
    } catch (error) {
      console.error('Error toggling blog visibility:', error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${selectedBlog}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      setBlogs(blogs.filter(blog => blog.id !== selectedBlog));
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (paginationLinks?.next) {
      const nextPage = currentPage + 1;
      handlePageChange(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (paginationLinks?.prev) {
      const prevPage = currentPage - 1;
      handlePageChange(prevPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-8 p-8 rounded-2xl backdrop-blur-sm ${
        isDarkMode 
          ? "bg-gray-800/40 shadow-xl shadow-gray-900/30 border border-gray-700/50" 
          : "bg-white/60 shadow-xl shadow-gray-100/30 border border-gray-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className={`text-3xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? "from-white to-gray-300 bg-clip-text text-transparent" 
              : "from-gray-800 to-gray-600 bg-clip-text text-transparent"
          }`}>
            Blog Posts
          </h2>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Manage and organize your blog content
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/admin/dashboard/blog/create")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
            isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-lg hover:shadow-gray-900/20"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-100/20"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Blog</span>
        </motion.button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`h-28 rounded-xl animate-pulse ${
                isDarkMode ? "bg-gray-700/30" : "bg-gray-100/50"
              }`}
            />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="space-y-6">
          <BlogList
            blogs={blogs}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
            onToggleVisibility={handleToggleVisibility}
          />
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              hasNextPage={paginationLinks?.hasNextPage ?? false}
              hasPreviousPage={paginationLinks?.hasPreviousPage ?? false}
            />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col items-center justify-center py-16 rounded-2xl ${
            isDarkMode ? "bg-gray-700/20 border border-gray-700/30" : "bg-gray-50/50 border border-gray-100"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Edit3 className={`w-16 h-16 mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          </motion.div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            No blog posts yet
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Create your first blog post to get started
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/dashboard/blog/create")}
            className={`mt-6 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-400 hover:from-blue-500/30 hover:to-blue-400/30"
                : "bg-gradient-to-r from-blue-500/10 to-blue-400/10 text-blue-600 hover:from-blue-500/20 hover:to-blue-400/20"
            }`}
          >
            Create Your First Blog
          </motion.button>
        </motion.div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </motion.div>
  );
}


interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string;
  createdAt: string;
  readingTime: number;
  isHidden: boolean;
}

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blogId: string) => void;
  onDelete: (blogId: string) => void;
  onToggleVisibility: (blogId: string, isHidden: boolean) => void;
}

function BlogList({
  blogs,
  onEdit,
  onDelete,
  onToggleVisibility,
}: BlogListProps) {
  const { isDarkMode } = useGlobalContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`group relative rounded-xl overflow-hidden ${
            isDarkMode 
              ? "bg-gray-800/50 hover:bg-gray-800/70" 
              : "bg-white hover:bg-gray-50"
          } shadow-sm hover:shadow-md transition-all duration-300`}
        >
          <div className="relative h-48">
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className={`text-lg font-semibold line-clamp-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                {blog.title}
              </h3>
            </div>
          </div>
          
          <div className="p-4">
            <p className={`text-sm mb-4 line-clamp-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {blog.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div className={`flex items-center gap-1.5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{blog.readingTime} min</span>
                </div>
                <div className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {format(new Date(blog.createdAt), 'MMM dd')}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleVisibility(blog.id, blog.isHidden)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title={blog.isHidden ? "Show Blog" : "Hide Blog"}
                >
                  {blog.isHidden ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(blog.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      : "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  title="Edit Blog"
                >
                  <PenSquare className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(blog.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      : "text-red-500 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title="Delete Blog"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            blog.isHidden
              ? isDarkMode
                ? "bg-gray-700/80 text-gray-300"
                : "bg-gray-100 text-gray-600"
              : isDarkMode
                ? "bg-gray-700/80 text-gray-300"
                : "bg-gray-100 text-gray-600"
          }`}>
            {blog.isHidden ? "Hidden" : "Published"}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
