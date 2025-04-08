"use client";

import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiImage, FiSave, FiTrash2, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"
import DeleteAccountModal from "./DeleteAccountModal";
import LogoutModal from "./LogoutModal";

interface AccountData {
  name: string;
  email: string;
  avatar: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function AccountTab() {
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [accountData, setAccountData] = useState<AccountData>({
    name: "",
    email: "",
    avatar: "",
    provider: "",
    createdAt: "",
    updatedAt: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
        {
          headers: {
         'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        },
       
      );
      if (response.data.success) {
        setAccountData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
      toast.error("Failed to load account data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
        {
          name: accountData.name,
          email: accountData.email,
          avatar: accountData.avatar,
        },
        {
          headers:{
            "Authorization" : `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/change-password`,
        passwordData,
        {
          headers:{
            "Authorization" : `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Password updated successfully");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
        {
          headers:{
            "Authorization" : `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Account deleted successfully");
        router.push("/auth");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className={`h-32 w-32 mx-auto rounded-full ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        } animate-pulse`} />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 w-24 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded animate-pulse`} />
              <div className={`h-10 w-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded animate-pulse`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Profile and Password */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-6 md:p-8 rounded-2xl ${
              isDarkMode ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/50 backdrop-blur-sm"
            } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <h2 className={`text-2xl font-bold mb-8 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Profile Information
            </h2>
            <div className="space-y-8">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-40 h-40 group cursor-pointer">
                  <Image
                    src={accountData.avatar || "/placeholder-avatar.png"}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover ring-4 ring-offset-4 ring-blue-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiImage className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CldUploadWidget
                  uploadPreset="profile_uploads"
                  onSuccess={(result: any) => {
                    if (result.info && result.info.secure_url) {
                      setAccountData({
                        ...accountData,
                        avatar: result.info.secure_url,
                      });
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all transform hover:scale-105 cursor-pointer ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <FiImage className="w-5 h-5" />
                      Change Photo
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium cursor-text ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="w-5 h-5" />
                    Name
                  </div>
                  <input
                    type="text"
                    value={accountData.name}
                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-all cursor-text ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                </label>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium cursor-text ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="w-5 h-5" />
                    Email
                  </div>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-all cursor-text ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                </label>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all transform hover:scale-105 cursor-pointer ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FiSave className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Password Section */}
          {accountData.provider === "credentials" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`p-6 md:p-8 rounded-2xl ${
                isDarkMode ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/50 backdrop-blur-sm"
              } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <h2 className={`text-2xl font-bold mb-8 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                Change Password
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium cursor-text ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Current Password
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className={`w-full mt-2 px-4 py-3 rounded-xl border transition-all cursor-text ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-medium cursor-text ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    New Password
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className={`w-full mt-2 px-4 py-3 rounded-xl border transition-all cursor-text ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-medium cursor-text ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Confirm New Password
                    <input
                      type="password"
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                      className={`w-full mt-2 px-4 py-3 rounded-xl border transition-all cursor-text ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                  </label>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handlePasswordChange}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all transform hover:scale-105 cursor-pointer ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <FiLock className="w-5 h-5" />
                    {isSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Delete Account and Logout */}
        <div className="lg:col-span-4 space-y-6">
          {/* Delete Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`p-6 md:p-8 rounded-2xl ${
              isDarkMode ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/50 backdrop-blur-sm"
            } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <h2 className={`text-xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Delete Account
            </h2>
            <div className="space-y-4">
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all transform hover:scale-105 w-full justify-center cursor-pointer ${
                  isDarkMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                <FiTrash2 className="w-5 h-5" />
                Delete Account
              </button>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`p-6 md:p-8 rounded-2xl ${
              isDarkMode ? "bg-gray-800/50 backdrop-blur-sm" : "bg-white/50 backdrop-blur-sm"
            } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <h2 className={`text-xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Session
            </h2>
            <div className="space-y-4">
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Click the button below to safely log out of your account.
              </p>
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all transform hover:scale-105 w-full justify-center cursor-pointer ${
                  isDarkMode
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                }`}
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        isDeleting={isDeleting}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmText("");
        }}
        onConfirm={handleDeleteAccount}
        confirmText={deleteConfirmText}
        onConfirmTextChange={setDeleteConfirmText}
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
