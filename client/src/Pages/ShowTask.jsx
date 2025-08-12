import React, { useEffect, useState } from "react";
import z, { ZodError } from "zod";
import { getZodError } from "../helper/getZodError";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  Pending: "bg-purple-400/10 text-purple-400 border-purple-400/30",
  Running: "bg-indigo-400/10 text-indigo-400 border-indigo-400/30",
  Completed: "bg-fuchsia-400/10 text-fuchsia-400 border-fuchsia-400/30",
  Failed: "bg-rose-400/10 text-rose-400 border-rose-400/30",
};

const ShowTask = () => {
  const [apiData, setApiData] = useState(null);
  const [formData, setFormData] = useState({});
  const [err, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { taskid } = useParams();

  const taskSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long").max(500, "Description must be at most 500 characters long"),
    status: z.enum(["Pending", "Running", "Completed", "Failed"]),
  });

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (err[e.target.name]) {
      setError({
        ...err,
        [e.target.name]: null,
      });
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/show-task/${taskid}`);
        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.message || "Failed to fetch task");

        setApiData(responseData);
        setFormData(responseData.taskData || {});
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTasks();
  }, [taskid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = taskSchema.parse(formData);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update-task/${taskid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Update failed");
      }

      toast.success(responseData.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const getError = getZodError(error.issues);
        setError(getError);
      }
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  p-4 flex justify-center items-start sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md sm:max-w-3xl"
      >
        <AnimatePresence>
          {isLoading ? (
            <motion.div key="loading" exit={{ opacity: 0 }} className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
              />
            </motion.div>
          ) : apiData ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl rounded-2xl border border-purple-800 shadow-lg sm:shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-2">
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Task Details
                </motion.h1>

                {formData.status && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[formData.status]}`}
                  >
                    {formData.status}
                  </motion.span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block mb-1 sm:mb-2 text-sm font-medium text-purple-300">Title</label>
                  <input
                    value={formData?.title || ""}
                    onChange={handleInput}
                    name="title"
                    type="text"
                    className="bg-purple-900/50 border border-purple-800 text-purple-200 text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-2 sm:p-3 placeholder-purple-400 transition-all duration-200"
                    placeholder="Enter task title"
                    required
                  />
                  {err?.title && (
                    <motion.span className="absolute text-rose-400 text-xs mt-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {err.title}
                    </motion.span>
                  )}
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block mb-1 sm:mb-2 text-sm font-medium text-purple-300">Description</label>
                  <textarea
                    value={formData?.description || ""}
                    onChange={handleInput}
                    name="description"
                    rows="4"
                    className="block p-2 sm:p-3 w-full text-sm text-purple-200 bg-purple-900/50 rounded-lg border border-purple-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-purple-400 transition-all duration-200"
                    placeholder="Describe your task..."
                  />
                  {err?.description && (
                    <motion.span className="absolute text-rose-400 text-xs mt-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {err.description}
                    </motion.span>
                  )}
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block mb-1 sm:mb-2 text-sm font-medium text-purple-300">Status</label>
                  <select
                    name="status"
                    value={formData?.status || "Pending"}
                    onChange={handleInput}
                    className="block p-2 sm:p-3 w-full text-sm text-purple-200 bg-purple-900/50 rounded-lg border border-purple-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="Pending" className="bg-purple-950">
                      Pending
                    </option>
                    <option value="Running" className="bg-purple-950">
                      Running
                    </option>
                    <option value="Completed" className="bg-purple-950">
                      Completed
                    </option>
                    <option value="Failed" className="bg-purple-950">
                      Failed
                    </option>
                  </select>
                  {err?.status && (
                    <motion.span className="absolute text-rose-400 text-xs mt-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {err.status}
                    </motion.span>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`cursor-pointer relative overflow-hidden w-full py-2 sm:py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow ${
                      isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating Task...
                      </span>
                    ) : (
                      <span>Update Task</span>
                    )}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </button>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-900/70 backdrop-blur-xl rounded-2xl border border-purple-800 p-6 sm:p-8 text-center"
            >
              <div className="text-fuchsia-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 sm:h-16 w-12 sm:w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-purple-200 mb-2">Task Not Found</h3>
              <p className="text-sm sm:text-base text-purple-400">The requested task could not be found or may have been deleted.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ShowTask;