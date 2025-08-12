import React, { useState } from "react";
import z, { ZodError } from "zod";
import { getZodError } from "../helper/getZodError";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiPlus, FiLoader, FiAlertCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [formData, setFormData] = useState({});
    const [err, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const taskSchema = z.object({
        title: z.string()
            .min(2, "Title must be at least 2 characters long")
            .max(100, "Title must be at most 100 characters long"),
        description: z.string()
            .min(3, "Description must be at least 3 characters long")
            .max(500, "Description must be at most 500 characters long"),
    });

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (err[e.target.name]) {
            setError({
                ...err,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSuccess(false);

        try {
            const validatedData = taskSchema.parse(formData);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/create-task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validatedData),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message);

            setFormData({});
            setError({});
            setIsSuccess(true);

            toast.success(responseData.message, {
                icon: <FiCheckCircle className="text-emerald-400" />
            });

        } catch (error) {
            if (error instanceof ZodError) {
                const getError = getZodError(error.issues);
                setError(getError);
            }
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "dark",
                icon: <FiAlertCircle className="text-rose-400" />
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-8"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md  backdrop-blur-sm rounded-xl border border-purple-700 shadow-lg"
            >
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b border-purple-700">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-purple-300 hover:text-white mr-2"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                        New Task
                    </h1>
                </div>

                <div className="p-5 md:p-6">
                    <div className="hidden md:flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <FiPlus className="h-5 w-5 text-purple-400" />
                        </div>
                        <motion.h1
                            className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Create New Task
                        </motion.h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block mb-2 text-sm font-medium text-purple-300">
                                Task Title
                            </label>
                            <div className="relative">
                                <input
                                    value={formData?.title || ""}
                                    onChange={handleInput}
                                    name="title"
                                    type="text"
                                    className="bg-purple-800/30 border border-purple-600 text-    -200 text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3 pl-10 placeholder-purple-400 transition-all duration-200"
                                    placeholder="Enter task title"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                            {err?.title && (
                                <motion.div
                                    className="flex items-center gap-1 text-pink-400 text-xs mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <FiAlertCircle className="h-3 w-3" />
                                    <span>{err.title}</span>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block mb-2 text-sm font-medium text-purple-300">
                                Task Description
                            </label>
                            <div className="relative">
                                <textarea
                                    value={formData?.description || ""}
                                    onChange={handleInput}
                                    name="description"
                                    rows="4"
                                    className="block p-3 w-full text-sm text-purple-200 bg-purple-800/30 rounded-lg border border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-purple-400 transition-all duration-200 pl-10"
                                    placeholder="Describe your task..."
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                            </div>
                            {err?.description && (
                                <motion.div
                                    className="flex items-center gap-1 text-pink-400 text-xs mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <FiAlertCircle className="h-3 w-3" />
                                    <span>{err.description}</span>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="pt-2"
                        >
                            <button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className={`relative overflow-hidden w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-lg cursor-pointer ${isSubmitting || isSuccess ? "opacity-90 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <FiLoader className="animate-spin h-5 w-5" />
                                        Creating Task...
                                    </span>
                                ) : isSuccess ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <FiCheckCircle className="h-5 w-5" />
                                        Task Created!
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <FiPlus className="h-5 w-5" />
                                        Create Task
                                    </span>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2"
                        >
                            <FiCheckCircle className="h-4 w-4" />
                            Task created successfully! You can create another one.
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HomePage;