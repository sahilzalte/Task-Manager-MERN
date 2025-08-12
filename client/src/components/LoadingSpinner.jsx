import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", color = "purple" }) => {
    // Size variants
    const sizeClasses = {
        xs: "w-6 h-6 border-2",
        sm: "w-8 h-8 border-3",
        md: "w-12 h-12 border-4",
        lg: "w-16 h-16 border-[6px]",
        xl: "w-20 h-20 border-[8px]"
    };

    // Color variants
    const colorClasses = {
        purple: "border-purple-500 border-t-transparent",
        blue: "border-blue-500 border-t-transparent",
        pink: "border-pink-500 border-t-transparent",
        white: "border-white border-t-transparent",
        gray: "border-gray-400 border-t-transparent"
    };

    return (
        <div
            role="status"
            aria-label="Loading"
            className="flex items-center justify-center"
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
                className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
                style={{
                    // Smooth the edges of the spinner
                    borderRightColor: "transparent",
                    borderBottomColor: "transparent"
                }}
            >
                {/* Optional inner pulse effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full rounded-full"
                />
            </motion.div>

            {/* Optional accessibility text (visually hidden) */}
            <span className="sr-only">Loading content...</span>
        </div>
    );
};

export default LoadingSpinner;