"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import StatsGrid from "@/components/dashboard/overview/StatsGrid";
import BlogsTab from "@/components/dashboard/blogs/BlogsTab";
import PortfolioTab from "@/components/dashboard/portfolio/PortfolioTab";
import AccountTab from "@/components/dashboard/account/AccountTab";
import { FiMenu, FiX, FiLogOut, FiBell, FiSearch, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { FiHome, FiEdit3, FiBriefcase, FiMail } from "react-icons/fi";
import NewsletterTab from "@/components/dashboard/newsletter/NewsletterTab";

type TabType = 'overview' | 'blogs' | 'portfolio' | 'account' | 'newsletter';

interface DashboardProps {
  // Add any props that Dashboard component might receive
}

interface Stats {
  totalViews: number;
  totalBlogs: number;
  totalPortfolios: number;
  avgReadTime: number;
}

export default function Dashboard(props: DashboardProps) {
  const { isDarkMode } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();

  // Handle URL parameters on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['overview', 'blogs', 'portfolio', 'account', 'newsletter'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    router.push(`/admin/dashboard?tab=${tab}`);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.replace("/admin");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <StatsGrid
            stats={{
              totalViews: 1234,
              totalBlogs: 12,
              totalPortfolios: 8,
              avgReadTime: 5,
            }}
          />
        );
      case 'blogs':
        return <BlogsTab />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'account':
        return <AccountTab />;
      case 'newsletter':
        return <NewsletterTab />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-white"}`}>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: isSidebarOpen ? 0 : -300, opacity: isSidebarOpen ? 1 : 0 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed lg:static top-0 left-0 w-[240px] h-screen ${
            isDarkMode ? "bg-gray-900/95" : "bg-white/95"
          } border-r ${
            isDarkMode ? "border-gray-800/50" : "border-gray-200/50"
          } shadow-2xl z-40 backdrop-blur-md`}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? "bg-gray-800/80" : "bg-gray-50/80"
              } backdrop-blur-sm`}>
                <FiUser className={`w-5 h-5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`} />
              </div>
              <div>
                <h1 className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                  isDarkMode ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
                }`}>
                  Dashboard
                </h1>
                <p className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Welcome back
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-1">
              <DashboardTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                orientation="vertical"
              />
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className={`sticky top-0 z-30 px-6 py-4 border-b ${
          isDarkMode ? "bg-gray-900/95 border-gray-800/50" : "bg-white/95 border-gray-200/50"
        } backdrop-blur-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-xl lg:hidden ${
                  isDarkMode 
                    ? "bg-gray-800/80 hover:bg-gray-700/80" 
                    : "bg-white/80 hover:bg-gray-50/80"
                } shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <FiX className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
                ) : (
                  <FiMenu className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
                )}
              </motion.button>
              <div className={`relative ${isSearchOpen ? 'w-64' : 'w-10'} transition-all duration-300`}>
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400"
                      : "bg-gray-50/80 border-gray-200/50 text-gray-900 placeholder-gray-500"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm`}
                  style={{ opacity: isSearchOpen ? 1 : 0 }}
                />
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    isDarkMode ? "hover:bg-gray-700/80" : "hover:bg-gray-100/80"
                  }`}
                >
                  <FiSearch className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className={`p-2 rounded-xl transition-colors relative ${
                isDarkMode ? "hover:bg-gray-800/80" : "hover:bg-gray-100/80"
              }`}>
                <FiBell className={`w-5 h-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`} />
                {notifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 lg:p-8"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </main>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  orientation?: "horizontal" | "vertical";
}

const tabs = [
  { id: "overview", label: "Overview", icon: FiHome },
  { id: "blogs", label: "Blogs", icon: FiEdit3 },
  { id: "portfolio", label: "Portfolio", icon: FiBriefcase },
  { id: "newsletter", label: "Newsletter", icon: FiMail },
  { id: "account", label: "Account", icon: FiUser },
];
 function DashboardTabs({
  activeTab,
  onTabChange,
  orientation = "horizontal",
}: DashboardTabsProps) {
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();

  return (
    <AnimatePresence>
      <nav 
        className={`flex ${
          orientation === "vertical" 
            ? "flex-col space-y-1" 
            : "space-x-3 p-3 rounded-xl"
        } backdrop-blur-sm`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ease-in-out relative ${
                orientation === "vertical" ? "w-full" : ""
              } ${
                activeTab === tab.id
                  ? isDarkMode
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-500/10 text-blue-600"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-200 ${activeTab === tab.id ? "scale-110" : ""}`} />
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-xl ${
                    isDarkMode ? "bg-blue-500/20" : "bg-blue-500/10"
                  }`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </AnimatePresence>
  );
}
