import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AuthLayout = ({ children, title, subtitle }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 tablet8:px-6 transition-colors duration-200">
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 tablet8:top-6 tablet8:right-6 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </button>

            <div className="w-full max-w-md">
                {/* Branding with Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img
                            src="/src/img/Logo.png"
                            alt="ClearTag Logo"
                            className="w-32 h-32 tablet8:w-40 tablet8:h-40 object-contain"
                        />
                    </div>
                    <h1 className="text-2xl tablet8:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {title || 'Government Portal'}
                    </h1>
                    {subtitle && (
                        <p className="text-sm tablet8:text-base text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 tablet8:p-8">
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-xs tablet8:text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Secure Government Authentication System
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
