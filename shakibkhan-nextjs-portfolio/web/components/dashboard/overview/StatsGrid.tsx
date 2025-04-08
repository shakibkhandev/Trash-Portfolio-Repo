"use client";

import { motion } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { Eye, PenSquare, Users, Clock } from "lucide-react";
import StatCard from "../StatCard";

interface Stats {
  totalViews: number;
  totalBlogs: number;
  totalPortfolios: number;
  avgReadTime: number;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const { isDarkMode } = useGlobalContext();

  const statCards = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs.toLocaleString(),
      icon: PenSquare,
    },
    {
      title: "Portfolio Items",
      value: stats.totalPortfolios.toLocaleString(),
      icon: Users,
    },
    {
      title: "Avg. Read Time",
      value: `${stats.avgReadTime} min`,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        </motion.div>
      ))}
    </div>
  );
}
