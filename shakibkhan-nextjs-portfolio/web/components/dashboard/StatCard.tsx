"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContextProvider";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  const { isDarkMode } = useGlobalContext();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-6 rounded-xl shadow-lg ${
        isDarkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {title}
          </p>
          <h3 className={`mt-2 text-2xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </h3>
          {trend && (
            <p className={`mt-1 text-sm ${
              trend.isPositive
                ? 'text-green-500'
                : 'text-red-500'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          isDarkMode
            ? 'bg-gray-700'
            : 'bg-blue-50'
        }`}>
          <Icon className={
            isDarkMode
              ? 'text-blue-400'
              : 'text-blue-600'
          } size={24} />
        </div>
      </div>
    </motion.div>
  );
}
