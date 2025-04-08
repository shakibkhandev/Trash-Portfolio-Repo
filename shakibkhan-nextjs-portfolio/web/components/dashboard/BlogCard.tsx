"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import Image from "next/image";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  readingTime?: number;
  tags?: { id: string; label: string; }[];
  isHidden?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  date,
  imageUrl,
  readingTime,
  tags = [],
  isHidden = false,
  onEdit,
  onDelete,
  onToggleVisibility,
}: BlogCardProps) {
  const { isDarkMode } = useGlobalContext();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-xl shadow-lg overflow-hidden ${
        isDarkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-100'
      }`}
    >
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-300">
              {date}
            </p>
            {readingTime && (
              <p className="text-sm text-gray-300">
                {readingTime} min read
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {excerpt}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onToggleVisibility}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={isHidden ? "Unhide" : "Hide"}
          >
            {isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={onEdit}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-red-400'
                : 'hover:bg-gray-100 text-red-500'
            }`}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
