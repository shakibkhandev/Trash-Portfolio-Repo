"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { HiOutlineMail } from "react-icons/hi";

export default function AuthPage() {
  const { isDarkMode } = useGlobalContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/auth/sign-up" : "/auth/sign-in";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        isSignUp
          ? formData
          : { email: formData.email, password: formData.password }
      );

      if (response.data.success) {
        if (isSignUp) {
          setSuccessMessage(response.data.message || "Please check your email for verification");
          setSignupSuccess(true);
          toast.success("Registration successful!");
        } else {
          if (response.data.data?.user) {
            toast.success(response.data.message || "Successfully signed in!");
            // Set access token with expiry
            Cookies.set("access_token", response.data.data.accessToken, {
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
              secure: true,
              sameSite: "strict"
            });
            
            // Set refresh token with longer expiry
            Cookies.set("refresh_token", response.data.data.refreshToken, {
              expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
              secure: true,
              sameSite: "strict"
            });

            router.push("/admin");
          }
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setSignupSuccess(false);
    setIsSignUp(false);
    setFormData({ email: "", password: "", name: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <Toaster position="top-center" expand={true} richColors />
      
      <AnimatePresence mode="wait">
        {signupSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`max-w-md w-full p-8 rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <HiOutlineMail className={`w-10 h-10 ${
                  isDarkMode ? "text-green-400" : "text-green-500"
                }`} />
              </div>
              
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Verify your email
              </h2>
              
              <p className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {successMessage}
              </p>
              
              <button
                onClick={handleBackToLogin}
                className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`max-w-md w-full ${isDarkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-xl shadow-lg`}
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
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {isSignUp ? "Sign up to get started" : "Sign in to continue"}
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 mb-6">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 ${
                  isDarkMode 
                    ? "bg-white text-gray-900 hover:bg-gray-100" 
                    : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
                } transition-all duration-300`}
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </motion.button>

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 ${
                  isDarkMode 
                    ? "bg-[#24292F] text-white hover:bg-[#24292F]/90" 
                    : "bg-[#24292F] text-white hover:bg-[#24292F]/90"
                } transition-all duration-300`}
              >
                <FaGithub className="text-xl" />
                Continue with GitHub
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="relative flex items-center gap-2 my-8"
            >
              <div className={`flex-1 h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              <span className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                or continue with email
              </span>
              <div className={`flex-1 h-px ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg text-base outline-none ${
                      isDarkMode 
                        ? "bg-gray-700/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70" 
                        : "bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100"
                    } transition-all duration-300`}
                  />
                </motion.div>
              )}
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg text-base outline-none ${
                    isDarkMode 
                      ? "bg-gray-700/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70" 
                      : "bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100"
                  } transition-all duration-300`}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg text-base outline-none ${
                    isDarkMode 
                      ? "bg-gray-700/50 text-white placeholder:text-gray-400 focus:bg-gray-700/70" 
                      : "bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:bg-gray-100"
                  } transition-all duration-300`}
                />
                {!isSignUp && (
                  <div className="mt-2 text-right">
                    <button
                    onClick={()=> router.push("/auth/forgot-password")}
                      type="button"
                      className={`text-sm font-medium ${
                        isDarkMode 
                          ? "text-gray-400 hover:text-white" 
                          : "text-gray-600 hover:text-gray-900"
                      } transition-colors duration-200`}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </motion.div>

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium relative overflow-hidden ${
                  isDarkMode 
                    ? "bg-white text-gray-900 hover:bg-gray-100" 
                    : "bg-gray-900 text-white hover:bg-gray-800"
                } transition-all duration-300 disabled:opacity-70`}
              >
                {isLoading ? (
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
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </motion.button>
            </motion.form>

            <motion.p 
              variants={itemVariants}
              className={`mt-6 text-center text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className={`font-medium ${
                  isDarkMode ? "text-white hover:text-gray-200" : "text-gray-900 hover:text-gray-700"
                }`}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
