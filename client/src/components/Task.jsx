import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiEye, FiTrash2, FiEdit2, FiClock, FiPlay, FiCheck, FiX } from 'react-icons/fi';

const statusConfig = {
    Pending: {
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: <FiClock className="text-amber-400" />
    },
    Running: {
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        icon: <FiPlay className="text-blue-400" />
    },
    Completed: {
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: <FiCheck className="text-emerald-400" />
    },
    Failed: {
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        icon: <FiX className="text-rose-400" />
    }
};

const Task = ({ props, onDelete, isDeleting, statusIcons }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDelete = async () => {
        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }
        await onDelete(props._id);
        setIsConfirmingDelete(false);
    };

    const cancelDelete = () => {
        setIsConfirmingDelete(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className="relative"
        >
            <motion.div
                whileHover={{ y: -2 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className={`bg-purple-850/30 backdrop-blur-sm border ${isHovered ? 'border-purple-600' : 'border-purple-700'} rounded-xl p-4 mb-4 shadow-lg transition-all duration-200`}
            >
                <div className="flex justify-between items-start mb-2">
                    <motion.h3
                        className="text-lg font-semibold text-gray-100 line-clamp-1 pr-2"
                        layout="position"
                    >
                        {props.title}
                    </motion.h3>

                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[props.status]?.color || 'bg-purple-700/50'}`}>
                        {statusConfig[props.status]?.icon || statusIcons?.[props.status]}
                        <span>{props.status}</span>
                    </div>
                </div>

                <motion.p
                    className="text-gray-300 text-sm mb-4 line-clamp-2"
                    layout="position"
                >
                    {props.description}
                </motion.p>

                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                        {new Date(props.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>

                    <div className="flex gap-2">
                        <Link
                            to={`/show-task/${props._id}`}
                            className="p-2 bg-purple-700/50 hover:bg-blue-700/30 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                            title="Edit Task"
                        >
                            <FiEdit2 className="w-4 h-4" />
                        </Link>

                        <AnimatePresence mode="wait">
                            {isConfirmingDelete ? (
                                <motion.div
                                    key="confirm-delete"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex gap-2 overflow-hidden"
                                >
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="p-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white transition-colors flex items-center gap-1"
                                        title="Confirm Delete"
                                    >
                                        {isDeleting ? (
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FiCheck className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={cancelDelete}
                                        className="p-2 bg-purple-600/80 hover:bg-purple-600 rounded-lg text-white transition-colors"
                                        title="Cancel"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="delete-button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleDelete}
                                    className="p-2 bg-purple-700/50 hover:bg-rose-700/30 rounded-lg text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Delete Task"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {isHovered && (
                    <motion.div
                        className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl blur-md opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
};

export default Task;