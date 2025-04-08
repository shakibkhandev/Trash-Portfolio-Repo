"use client";

import { useGlobalContext } from "@/context/GlobalContextProvider";
import { useRouter } from "next/navigation";
import { FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface Tag {
  id: string;
  label: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  createdAt: string;
  readingTime: string;
  category: string;
  slug: string;
  tags: Tag[];
  isHidden: boolean;
}

export default function Page() {
  const { isDarkMode } = useGlobalContext();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/public`
        );
        const sortedBlogs = response.data.data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="w-full h-[50vh] relative">
          <div className={`absolute inset-0 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className={`p-8 rounded-xl ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-xl`}>
            <div className="space-y-8">
              <div className={`h-12 w-3/4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} animate-pulse`} />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`rounded-xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <div className="h-48 bg-gray-700 animate-pulse" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 w-3/4 bg-gray-600 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-600 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <div className="relative w-full h-[50vh]">
        {blogs[0] && (
          <>
            <Image
              src={blogs[0].image_url}
              alt="Blog Header"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${
              isDarkMode 
                ? "from-gray-900/30 via-gray-900/60 to-gray-900" 
                : "from-gray-50/30 via-gray-50/60 to-gray-50"
            }`} />
          </>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Latest Blog Posts
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-lg md:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Insights and articles about technology, development, and design
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`p-8 rounded-xl shadow-xl ${
            isDarkMode ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-sm`}
        >
          {blogs.length > 0 ? (
            <div className="space-y-16">
              {/* Featured Post */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => router.push(`/blogs/${blogs[0].slug}`)}
                className="group cursor-pointer"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                    <Image
                      src={blogs[0].image_url}
                      alt={blogs[0].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {blogs[0].tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            isDarkMode 
                              ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <h2 
                      className={`text-3xl font-bold leading-tight transition-colors ${
                        isDarkMode 
                          ? "text-white group-hover:text-blue-400" 
                          : "text-gray-900 group-hover:text-blue-600"
                      }`}
                    >
                      {blogs[0].title}
                    </h2>
                    <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {blogs[0].description}
                    </p>
                    <div className={`flex items-center gap-6 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>{format(new Date(blogs[0].createdAt), 'MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>{blogs[0].readingTime} min read</span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 font-medium transition-colors ${
                      isDarkMode 
                        ? "text-blue-400 group-hover:text-blue-300" 
                        : "text-blue-600 group-hover:text-blue-700"
                    }`}>
                      Read More <FiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Blog Grid */}
              {blogs.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.slice(1).map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                      onClick={() => router.push(`/blogs/${blog.slug}`)}
                      className={`group cursor-pointer rounded-xl overflow-hidden ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.image_url}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags?.map((tag) => (
                            <span
                              key={tag.id}
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                isDarkMode 
                                  ? "bg-gray-700 text-gray-300" 
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                        <h3 
                          className={`text-xl font-bold mb-2 transition-colors ${
                            isDarkMode 
                              ? "text-white group-hover:text-blue-400" 
                              : "text-gray-900 group-hover:text-blue-600"
                          }`}
                        >
                          {blog.title}
                        </h3>
                        <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {blog.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <FiCalendar className="w-4 h-4" />
                            <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <FiClock className="w-4 h-4" />
                            <span>{blog.readingTime} min</span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                No blog posts available.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
}
