import React from "react";
import { motion } from "framer-motion";

const Badge = ({ props }) => {
    const colorVariants = {
        blue: {
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            border: "border-blue-500/20",
            icon: (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        red: {
            bg: "bg-red-500/10",
            text: "text-red-400",
            border: "border-red-500/20",
            icon: (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        },
        green: {
            bg: "bg-green-500/10",
            text: "text-green-400",
            border: "border-green-500/20",
            icon: (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        yellow: {
            bg: "bg-yellow-500/10",
            text: "text-yellow-400",
            border: "border-yellow-500/20",
            icon: (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        purple: {
            bg: "bg-purple-500/10",
            text: "text-purple-400",
            border: "border-purple-500/20",
            icon: (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            )
        },
        gray: {
            bg: "bg-gray-500/10",
            text: "text-gray-400",
            border: "border-gray-500/20",
            icon: (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    };

    const variant = colorVariants[props.color] || colorVariants.gray;

    return (
        <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex items-center gap-1.5 ${variant.bg} ${variant.text} text-xs font-medium px-2.5 py-1 rounded-full border ${variant.border}`}
        >
            {variant.icon}
            {props.text}
        </motion.span>
    );
};

export default Badge;