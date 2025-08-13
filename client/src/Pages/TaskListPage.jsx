import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Task from "../components/Task";
import { FiPlus, FiAlertTriangle, FiList, FiRefreshCw } from "react-icons/fi";
import { RiTaskLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const statusIcons = {
    Pending: <FiRefreshCw className="text-amber-400" />,
    Running: <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />,
    Completed: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
    Failed: <FiAlertTriangle className="text-rose-400" />
};

const TaskListPage = () => {
    const [tasks, setTasks] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getTasks = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/get-all-task`);
                const responseData = await response.json();
                if (!response.ok) throw new Error(responseData.message || "Failed to fetch tasks");

                setTasks(responseData);
            } catch (error) {
                toast.error(error.message, {
                    position: "top-right",
                    theme: "dark",
                    autoClose: 5000,
                });
            } finally {
                setIsLoading(false);
                setRefresh(false);
            }
        };
        getTasks();
    }, [refresh]);

    const deleteTask = async (taskid) => {
        setDeletingId(taskid);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/delete-task/${taskid}`, {
                method: 'DELETE'
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to delete task");
            }

            setRefresh(true);
            toast.success(responseData.message, {
                position: "top-right",
                theme: "dark",
                autoClose: 3000,
                icon: <RiTaskLine className="text-purple-400" />
            });
        } catch (error) {
            toast.error(error.message, {
                position: "top-right",
                theme: "dark",
                autoClose: 5000,
                icon: <FiAlertTriangle className="text-rose-400" />
            });
        } finally {
            setDeletingId(null);
        }
    };

    const filteredTasks = tasks?.taskData?.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 md:p-8 flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto backdrop-blur-sm rounded-xl border border-purple-700 shadow-lg p-6"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3"
                    >
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <RiTaskLine className="h-6 w-6 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                            My Tasks
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-3"
                    >
                        <div className="relative flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-purple-800/70 border border-purple-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRefresh(true)}
                            className="p-2 bg-purple-800/70 border border-purple-700 rounded-lg text-gray-300 hover:text-white hover:bg-purple-700/50 transition-colors cursor-pointer"
                            title="Refresh tasks"
                        >
                            <FiRefreshCw className="h-5 w-5" />
                        </motion.button>
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-64 gap-4"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full" />
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 rounded-full animate-spin" />
                            </div>
                            <p className="text-gray-400">Loading your tasks...</p>
                        </motion.div>
                    ) : tasks?.status ? (
                        filteredTasks?.length > 0 ? (
                            <motion.div
                                key="task-list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-3"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-gray-400">
                                        Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {filteredTasks.map((task) => (
                                        <motion.div
                                            key={task._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Task
                                                props={task}
                                                onDelete={deleteTask}
                                                isDeleting={deletingId === task._id}
                                                statusIcons={statusIcons}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : searchQuery ? (
                            <motion.div
                                key="no-results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-purple-800/50 backdrop-blur-sm rounded-xl border border-purple-700 p-8 text-center"
                            >
                                <div className="text-purple-400 mb-4 flex justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-200 mb-2">
                                    No matching tasks found
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    We couldn't find any tasks matching "{searchQuery}"
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-4 py-2 text-sm bg-purple-700 hover:bg-purple-600 rounded-lg text-gray-200 transition-colors"
                                >
                                    Clear search
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-purple-800/50 backdrop-blur-sm rounded-xl border border-purple-700 p-8 text-center"
                            >
                                <div className="text-purple-400 mb-4 flex justify-center">
                                    <FiList className="h-16 w-16" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-200 mb-2">
                                    Your task list is empty
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Get started by creating your first task
                                </p>
                                <Link to={'/'}>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="cursor-pointer flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
                                    >
                                        <FiPlus className="h-5 w-5" />
                                        Create New Task
                                    </motion.button>
                                </Link>
                            </motion.div>
                        )
                    ) : (
                        <motion.div
                            key="error-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-purple-800/50 backdrop-blur-sm rounded-xl border border-purple-700 p-8 text-center"
                        >
                            <div className="text-rose-400 mb-4 flex justify-center">
                                <FiAlertTriangle className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-200 mb-2">
                                Failed to Load Tasks
                            </h3>
                            <p className="text-gray-400 mb-6">
                                We encountered an error while loading your tasks
                            </p>
                            <motion.button
                                onClick={() => setRefresh(true)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
                            >
                                <FiRefreshCw className="h-5 w-5" />
                                Try Again
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default TaskListPage;