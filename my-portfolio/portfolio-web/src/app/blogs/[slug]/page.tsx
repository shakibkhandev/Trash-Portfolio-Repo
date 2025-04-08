"use client";

import { useThemeState } from "@/context/zustand";
import { Colors } from "@/utils/Colors";
import axios from "axios";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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

export default function BlogPost() {
  const { params } = useParams<any>();
  const { theme } = useThemeState();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/blogs/${params.slug}`
        );
        setBlog(response.data.data);

        // Fetch related blogs based on tags
        const relatedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/blogs`
        );
        const allBlogs = relatedResponse.data.data;
        const related = allBlogs
          .filter(
            (b: Blog) =>
              b.id !== response.data.data.id &&
              b.tags.some((tag) =>
                response.data.data.tags.some((t: Tag) => t.id === tag.id)
              )
          )
          .slice(0, 3);
        setRelatedBlogs(related);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${Colors[theme].background.primary}`}>
        <div className="w-full h-[70vh] relative">
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div
            className={`p-8 rounded-2xl ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } ${Colors[theme].shadow}`}
          >
            <div className="space-y-8">
              <div className="h-8 w-3/4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${Colors[theme].background.primary}`}
      >
        <div className="text-center">
          <h1
            className={`text-2xl font-bold mb-4 ${Colors[theme].text.primary}`}
          >
            Blog post not found
          </h1>
          <button
            onClick={() => router.push("/blogs")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${Colors[theme].background.primary}`}>
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <Image
          src={blog.image_url}
          alt={blog.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-3">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300"
                        : "bg-white/10 text-white backdrop-blur-sm"
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {blog.title}
              </h1>
              {/* <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto">
                {blog.description}
              </p> */}
              <div className="flex items-center justify-center gap-8 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{blog.readingTime} read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div
          className={`p-8 rounded-2xl ${Colors[theme].shadow} ${
            theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-sm`}
        >
          <div className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/blogs")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </button>
              <button
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  navigator.share({
                    title: blog.title,
                    text: blog.description,
                    url: window.location.href,
                  });
                }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2
            className={`text-3xl font-bold mb-8 ${Colors[theme].text.primary}`}
          >
            Related Posts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog) => (
              <article
                key={relatedBlog.id}
                onClick={() => router.push(`/blogs/${relatedBlog.slug}`)}
                className={`group cursor-pointer rounded-2xl overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } ${
                  Colors[theme].shadow
                } hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={relatedBlog.image_url}
                    alt={relatedBlog.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {relatedBlog.tags.map((tag) => (
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
                    className={`text-xl font-bold mb-2 transition-colors ${
                      theme === "dark"
                        ? "text-white group-hover:text-blue-400"
                        : "text-gray-900 group-hover:text-blue-600"
                    }`}
                  >
                    {relatedBlog.title}
                  </h3>
                  <p
                    className={`text-sm mb-4 line-clamp-2 ${Colors[theme].text.secondary}`}
                  >
                    {relatedBlog.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div
                      className={`flex items-center gap-2 ${Colors[theme].text.secondary}`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(
                          new Date(relatedBlog.createdAt),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 ${Colors[theme].text.secondary}`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>{relatedBlog.readingTime} min</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .blog-content {
          font-size: 1.125rem;
          line-height: 1.75;
          color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
        }

        .blog-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          color: ${theme === "dark" ? "#f3f4f6" : "#111827"};
        }

        .blog-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1.25rem;
          color: ${theme === "dark" ? "#f3f4f6" : "#111827"};
        }

        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 1rem;
          color: ${theme === "dark" ? "#f3f4f6" : "#111827"};
        }

        .blog-content h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: ${theme === "dark" ? "#f3f4f6" : "#111827"};
        }

        .blog-content p {
          margin-bottom: 1.5rem;
        }

        .blog-content a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s;
        }

        .blog-content a:hover {
          text-decoration: underline;
        }

        .blog-content img {
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin: 2rem 0;
          max-width: 100%;
          height: auto;
        }

        .blog-content pre {
          background-color: ${theme === "dark" ? "#1f2937" : "#f3f4f6"};
          border-radius: 0.75rem;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .blog-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 0.875em;
          color: #3b82f6;
          background-color: ${theme === "dark" ? "#374151" : "#f3f4f6"};
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .blog-content pre code {
          color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
          background-color: transparent;
          padding: 0;
        }

        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          color: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
          margin: 1.5rem 0;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .blog-content ul {
          list-style-type: disc;
        }

        .blog-content ol {
          list-style-type: decimal;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
        }

        .blog-content hr {
          border: 0;
          border-top: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
          margin: 2rem 0;
        }
      `}</style>
    </main>
  );
}
