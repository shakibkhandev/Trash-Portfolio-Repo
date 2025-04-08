"use client";

import { useThemeState } from "@/context/zustand";
import { Colors } from "@/utils/Colors";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { theme } = useThemeState();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/blogs`
        );
        const sortedBlogs = response.data.data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${Colors[theme].background.primary}`}>
        <div className="w-full h-[50vh] relative">
          <div
            className={`absolute inset-0 ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-200"
            } animate-pulse`}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div
            className={`p-8 rounded-xl ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } ${Colors[theme].shadow}`}
          >
            <div className="space-y-8">
              <div
                className={`h-12 w-3/4 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                } animate-pulse`}
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`rounded-xl overflow-hidden ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
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
      className={`min-h-screen ${Colors[theme].background.primary}`}
    >
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {blogs[0] && (
          <>
            <Image
              src={blogs[0].image_url}
              alt="Blog Header"
              fill
              className="object-cover scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
          </>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            >
              Latest Blog Posts
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-200 font-light"
            >
              Insights and articles about technology, development, and design
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`p-8 rounded-2xl ${Colors[theme].shadow} ${
            theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-sm`}
        >
          {blogs.length > 0 ? (
            <div className="space-y-20">
              {/* Featured Post */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => router.push(`/blogs/${blogs[0].slug}`)}
                className="group cursor-pointer"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="relative h-[500px] rounded-2xl overflow-hidden">
                    <Image
                      src={blogs[0].image_url}
                      alt={blogs[0].title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-8">
                    <div className="flex flex-wrap gap-3">
                      {blogs[0].tags?.map((tag) => (
                        <span
                          key={tag.id}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                          }`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <h2
                      className={`text-4xl font-bold leading-tight transition-colors ${
                        theme === "dark"
                          ? "text-white group-hover:text-blue-400"
                          : "text-gray-900 group-hover:text-blue-600"
                      }`}
                    >
                      {blogs[0].title}
                    </h2>
                    <p
                      className={`text-xl ${Colors[theme].text.secondary} leading-relaxed`}
                    >
                      {blogs[0].description}
                    </p>
                    <div
                      className={`flex items-center gap-8 text-sm ${Colors[theme].text.secondary}`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>
                          {format(
                            new Date(blogs[0].createdAt),
                            "MMMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{blogs[0].readingTime} min read</span>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 font-medium transition-all duration-300 ${
                        theme === "dark"
                          ? "text-blue-400 group-hover:text-blue-300 group-hover:translate-x-2"
                          : "text-blue-600 group-hover:text-blue-700 group-hover:translate-x-2"
                      }`}
                    >
                      Read More <ArrowRight className="w-5 h-5" />
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
                      className={`group cursor-pointer rounded-2xl overflow-hidden ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      } ${
                        Colors[theme].shadow
                      } hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={blog.image_url}
                          alt={blog.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags?.map((tag) => (
                            <span
                              key={tag.id}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                theme === "dark"
                                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                              }`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                        <h3
                          className={`text-2xl font-bold mb-3 transition-colors ${
                            theme === "dark"
                              ? "text-white group-hover:text-blue-400"
                              : "text-gray-900 group-hover:text-blue-600"
                          }`}
                        >
                          {blog.title}
                        </h3>
                        <p
                          className={`text-base mb-6 line-clamp-2 ${Colors[theme].text.secondary}`}
                        >
                          {blog.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div
                            className={`flex items-center gap-2 ${Colors[theme].text.secondary}`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-2 ${Colors[theme].text.secondary}`}
                          >
                            <Clock className="w-4 h-4" />
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
            <div className="text-center py-16">
              <p className={`text-xl ${Colors[theme].text.secondary}`}>
                No blog posts available.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
}
