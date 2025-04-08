"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMail, HiOutlineCheck } from "react-icons/hi";

export default function VerifyEmail() {
  const router = useRouter();
  const {token} = useParams()
  const { isDarkMode } = useGlobalContext();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-email/${token}`
        );

        if (response.data.success) {
          setVerificationSuccess(true);
          toast.success(response.data.message || "Email verified successfully");
          // Wait for the animation and toast before redirecting
          setTimeout(() => {
            router.push("/auth");
          }, 2000);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Email verification failed";
        toast.error(errorMessage);
        setTimeout(() => {
          router.push("/auth");
        }, 1500);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <Toaster position="top-center" expand={true} richColors />
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`max-w-md w-full p-8 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="text-center space-y-6">
            {isVerifying ? (
              <>
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}>
                  <div className={`w-10 h-10 border-4 rounded-full animate-spin ${
                    isDarkMode 
                      ? "border-blue-400 border-t-transparent" 
                      : "border-blue-500 border-t-transparent"
                  }`}></div>
                </div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  Verifying your email
                </h2>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  Please wait while we verify your email address...
                </p>
              </>
            ) : verificationSuccess ? (
              <>
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-green-900/30" : "bg-green-100"
                }`}>
                  <HiOutlineCheck className={`w-10 h-10 ${
                    isDarkMode ? "text-green-400" : "text-green-500"
                  }`} />
                </div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  Email Verified!
                </h2>
                <p className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  Your email has been successfully verified. You can now sign in to your account.
                </p>
                <button
                  onClick={() => router.push("/auth")}
                  className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Continue to Sign In
                </button>
              </>
            ) : (
              <p className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Redirecting you...
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
