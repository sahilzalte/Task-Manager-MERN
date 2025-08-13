import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RouteIndex, RouteTaskList } from "../helper/Routename";
import { FiPlus, FiList, FiUser, FiMail, FiGithub, FiLinkedin, FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const Navigation = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const contactRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Tailwind CSS classes for the new theme
    const baseButtonClass = "flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium";
    const inactiveButtonClass = "text-purple-200 hover:text-white hover:bg-purple-800/50";
    const activeButtonClass = "text-white bg-royal-purple shadow-lg";

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contactRef.current && !contactRef.current.contains(event.target)) {
                setIsContactOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="pb-5 fixed md:top-12 left-0 w-full z-50">
            <div className="max-w-screen-md mx-auto px-4 sm:px-0">
                {/* Mobile Menu Button */}
                <div className="md:hidden flex justify-between items-center mb-4">
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                        Task Manager
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-purple-300 hover:text-white focus:outline-none"
                    >
                        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Navigation Content */}
                <div
                    ref={mobileMenuRef}
                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl backdrop-blur-md p-4 md:p-6 border border-purple-800 transition-all duration-300`}
                >
                    <div className="flex flex-col md:flex-row gap-3">
                        <NavLink
                            to={RouteIndex}
                            className={({ isActive }) =>
                                `${baseButtonClass} ${isActive ? activeButtonClass : inactiveButtonClass}`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FiPlus className="w-4 h-4" />
                            Add Task
                        </NavLink>
                        <NavLink
                            to={RouteTaskList}
                            className={({ isActive }) =>
                                `${baseButtonClass} ${isActive ? activeButtonClass : inactiveButtonClass}`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FiList className="w-4 h-4" />
                            My Tasks
                        </NavLink>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
                        <a
                            href="https://codebysahil.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${baseButtonClass} ${inactiveButtonClass} hover:bg-purple-800/50 hover:text-purple-200`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <FiUser className="w-4 h-4" />
                            Creator
                        </a>

                        <div className="relative" ref={contactRef}>
                            <button
                                onClick={() => setIsContactOpen(!isContactOpen)}
                                className={`cursor-pointer ${baseButtonClass} ${inactiveButtonClass} hover:bg-purple-800/50 hover:text-purple-200 ${isContactOpen ? 'bg-purple-800/50 text-purple-200' : ''} w-full md:w-auto`}
                            >
                                <FiMail className="w-4 h-4" />
                                Contact
                                <FiChevronDown className={`w-4 h-4 transition-transform ${isContactOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isContactOpen && (
                                <div className="md:absolute md:right-0 mt-2 w-full md:w-48 bg-purple-900/30 backdrop-blur-lg rounded-lg shadow-xl border border-purple-800 p-2 z-10 animate-fadeIn">
                                    <a
                                        href="mailto:contactcodebysahil@gmail.com"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-purple-200 hover:bg-purple-800/50 rounded-md transition-colors"
                                        onClick={() => {
                                            setIsContactOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <FiMail className="w-4 h-4" />
                                        Email
                                    </a>
                                    <a
                                        href="https://github.com/sahilzalte"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-purple-200 hover:bg-purple-800/50 rounded-md transition-colors"
                                        onClick={() => {
                                            setIsContactOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <FiGithub className="w-4 h-4" />
                                        GitHub
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/sahil-zalte"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-purple-200 hover:bg-purple-800/50 rounded-md transition-colors"
                                        onClick={() => {
                                            setIsContactOpen(false);
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <FiLinkedin className="w-4 h-4" />
                                        LinkedIn
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;