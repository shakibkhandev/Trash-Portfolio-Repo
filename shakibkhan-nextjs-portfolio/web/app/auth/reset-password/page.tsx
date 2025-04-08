'use client'
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
    const { isDarkMode } = useGlobalContext();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // TODO: Implement password reset logic here
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
            router.push("/auth/login");
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div>
                    <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Reset Password
                    </h2>
                    <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Enter your email and new password
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'border-gray-300 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Reset Password
                        </button>
                    </div>

                    <div className="text-center">
                        <Link 
                            href="/auth" 
                            className={`text-sm hover:text-blue-500 transition-colors duration-200 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}