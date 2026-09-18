import React, { useState, useEffect } from 'react';
import RoleNavigation from './RoleNavigation';
import UserMenu from './UserMenu';

const Header = ({ role, loading = false }) => {
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // {/* BACKEND: GET /auth/current-user */}
        // {/* Response: { id, name, email, role, avatar } */}

        // Simulated user data - replace with actual API call
        const fetchUser = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockUser = {
                name: role === 'admin' ? 'Admin User' : 'Officer Name',
                email: role === 'admin' ? 'admin@gov.in' : 'officer@gov.in',
                role: role,
            };

            setUser(mockUser);
        };

        fetchUser();
    }, [role]);

    if (loading || !user) {
        return (
            <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="px-4 tablet8:px-6">
                    {/* Loading Skeleton */}
                    <div className="flex items-center justify-between h-14 tablet8:h-16">
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="w-full px-3 tablet8:px-6">
                <div className="flex items-center justify-between h-14 tablet8:h-16">
                    {/* Left Side: Logo, Brand, Mobile Toggle, and Desktop Navigation */}
                    <div className="flex items-center gap-3 tablet8:gap-6 flex-1 min-w-0">
                        {/* Mobile Menu Toggle Button (Visible on mobile only) */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="tablet8:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Logo and Brand */}
                        <div className="flex items-center gap-2 tablet8:gap-3 flex-shrink-0">
                            <img
                                src="/src/img/logocart.png"
                                alt="ClearTag"
                                className="h-8 tablet8:h-10 w-auto object-contain"
                            />
                            <div className="hidden tablet8:block">
                                <h1 className="text-base tablet8:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                    {/* i18n: translate('app.name') */}
                                    Legal Metrology
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                    {/* i18n: translate('app.tagline') */}
                                    Compliance System
                                </p>
                            </div>
                        </div>

                        {/* Desktop Role-based Navigation (Visible on desktop screens tablet8 and above) */}
                        <div className="hidden tablet8:block flex-1 min-w-0 overflow-hidden">
                            <RoleNavigation role={role} />
                        </div>
                    </div>

                    {/* Right Side: User Menu */}
                    <div className="flex items-center gap-2 tablet8:gap-3 flex-shrink-0 ml-2 tablet8:ml-4">
                        <UserMenu user={user} role={role} />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown (Visible on mobile screens when opened) */}
            {mobileMenuOpen && (
                <div className="tablet8:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 shadow-lg animate-fade-in">
                    <RoleNavigation role={role} isMobile={true} onItemClick={() => setMobileMenuOpen(false)} />
                </div>
            )}
        </header>
    );
};

export default Header;
