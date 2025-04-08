'use client'
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function ForgetPasswordPage() {
    const {isDarkMode} = useGlobalContext();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement password reset logic
        setIsSubmitted(true);
    };

    return (
        <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen flex items-center justify-center p-4`}>
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} w-full max-w-md rounded-lg shadow-lg p-8`}>
                <div className="text-center mb-8">
                    <h1 className={`${isDarkMode ? "text-white" : "text-gray-900"} text-2xl font-bold mb-2`}>
                        Forgot Password?
                    </h1>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className={`${isDarkMode ? "text-gray-200" : "text-gray-700"} block text-sm font-medium mb-2`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} h-5 w-5`} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <div className={`${isDarkMode ? "bg-gray-700" : "bg-green-50"} p-4 rounded-md`}>
                        <p className={`${isDarkMode ? "text-green-300" : "text-green-800"} text-sm text-center`}>
                            If an account exists with that email, you will receive password reset instructions.
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link 
                        href="/auth"
                        className={`${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"} text-sm font-medium`}
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}