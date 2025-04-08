"use client";

import { useGlobalContext } from "@/context/GlobalContextProvider";
import { FiCalendar, FiTag, FiUser, FiClock, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { format } from "date-fns";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const BlogSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <article className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="w-full h-[60vh] relative">
        <div className={`absolute inset-0 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className={`p-8 rounded-xl ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-xl`}>
          <div className="space-y-8">
            <div className={`h-12 w-3/4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-8 w-24 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
              ))}
            </div>
            <div className="space-y-4 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-4 rounded ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

interface BlogLinks {
  next: string | null;
  previous: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface BlogData {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  isHidden: boolean;
  tags: Array<{ id: string; label: string }>;
}

interface BlogResponse {
  data: BlogData;
  links: BlogLinks;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [links, setLinks] = useState<BlogLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/slug/${params.slug}`);
        if (response.data.success) {
          setBlog(response.data.data);
          setLinks(response.data.links);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      setIsLoading(true);
      fetchBlog();
    }
  }, [params.slug]);

  if (isLoading) {
    return <BlogSkeleton isDarkMode={isDarkMode} />;
  }

  if (!blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Blog Not Found</h2>
          <p className="text-gray-500 mb-4">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/blogs')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <Image
          src={blog.image_url}
          alt={blog.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          isDarkMode 
            ? "from-transparent via-gray-900/70 to-gray-900" 
            : "from-transparent via-gray-50/70 to-gray-50"
        }`} />
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`p-8 rounded-xl shadow-xl ${
            isDarkMode ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-sm`}
        >
          {/* Title */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            {blog.title}
          </h1>

          {/* Metadata */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-12"
          >
            <div className={`flex flex-wrap gap-4 sm:gap-6 items-center text-sm px-4 sm:px-6 py-4 rounded-xl ${
              isDarkMode ? "bg-gray-800/50 text-gray-300" : "bg-gray-50 text-gray-600"
            }`}>
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                <span>Shakib Khan</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                <span>{blog.readingTime} min read</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <FiTag className="w-4 h-4 shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div 
              className={`prose prose-lg md:prose-xl ${isDarkMode ? "prose-invert" : ""} max-w-none ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } leading-relaxed blog-content`}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>

          {/* Navigation */}
          {links && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className={`border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"} pt-8`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                {links.hasPrevious ? (
                  <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => router.push(`/blogs/${links.previous?.split('/').pop()}`)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center ${
                      isDarkMode 
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Previous Article</span>
                  </motion.button>
                ) : (
                  <div />
                )}
                
                {links.hasNext ? (
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => router.push(`/blogs/${links.next?.split('/').pop()}`)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center ${
                      isDarkMode 
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>Next Article</span>
                    <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.article>
  );
}
