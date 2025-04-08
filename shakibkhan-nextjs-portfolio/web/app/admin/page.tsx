"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Cookies from "js-cookie";

export default function AdminPage() {
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/admin-access-request`,
        { code }, {
          headers : {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Admin access granted!");
        // Wait for toast to be visible
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid code. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    },
  };

  return (
    <main className={`min-h-screen w-full flex items-center justify-center p-4 ${
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <Toaster position="top-center" expand={true} richColors />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full max-w-md p-8 rounded-2xl ${
          isDarkMode 
            ? "bg-gray-800/50 border border-gray-700" 
            : "bg-white border border-gray-200"
        } backdrop-blur-md`}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
              isDarkMode ? "bg-white" : "bg-gray-900"
            }`}
          >
            <span className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-900" : "text-white"
            }`}>
              SK
            </span>
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Admin Access Required
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className={`${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Enter your admin access code to continue
          </motion.p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code"
              className={`w-full px-4 py-3 rounded-lg text-base outline-none ${
                isDarkMode 
                  ? "bg-gray-700/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70" 
                  : "bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100"
              } transition-all duration-300`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            type="submit"
            disabled={isVerifying || !code.trim()}
            className={`w-full py-3 rounded-lg font-medium relative overflow-hidden ${
              isDarkMode 
                ? "bg-white text-gray-900 hover:bg-gray-100" 
                : "bg-gray-900 text-white hover:bg-gray-800"
            } transition-all duration-300 disabled:opacity-70`}
          >
            {isVerifying ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <div className={`w-5 h-5 rounded-full border-2 border-t-transparent animate-spin ${
                  isDarkMode ? "border-gray-900" : "border-white"
                }`} />
              </motion.div>
            ) : (
              "Verify Access"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </main>
  );
}
