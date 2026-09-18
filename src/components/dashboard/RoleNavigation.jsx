import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const RoleNavigation = ({ role, isMobile = false, onItemClick }) => {
    const location = useLocation();

    // {/* BACKEND: GET navigation items based on role */}
    // {/* Response: { role, navigationItems: [...] } */}

    const navigationItems = {
        admin: [
            { name: 'Home', path: '/admin/dashboard', icon: 'home' },
            { name: 'Users', path: '/admin/users', icon: 'users' },
        ],
        officer: [
            { name: 'Home', path: '/officer/dashboard', icon: 'home' },
            { name: 'Scan Product', path: '/officer/scan-product?mode=camera', icon: 'scan' },
            { name: 'Upload Image', path: '/officer/scan-product?mode=upload', icon: 'upload' },
            { name: 'Platform Analytics', path: '/officer/platform-analytics', icon: 'grid' },
            { name: 'Reports', path: '/officer/violations', icon: 'alert' },
            { name: 'Download Extension', path: '/officer/download-extension', icon: 'download' },
            { name: 'Help', path: '/officer/help', icon: 'help' },
        ],
    };

    const items = navigationItems[role] || [];

    const getIcon = (iconName) => {
        const icons = {
            home: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            grid: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            users: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            scan: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            upload: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            ),
            alert: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            download: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
            chart: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            help: (
                <svg className="w-4 h-4 tablet8:w-5 tablet8:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        };
        return icons[iconName] || icons.home;
    };

    const isActive = (itemPath) => {
        const [pathName, searchString] = itemPath.split('?');
        if (location.pathname !== pathName) return false;
        if (!searchString) return true;
        if (searchString === 'mode=camera') {
            return !location.search || location.search.includes('mode=camera') || !location.search.includes('mode=upload');
        }
        return location.search.includes(searchString);
    };

    if (isMobile) {
        return (
            <nav className="flex flex-col space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onItemClick}
                        className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                            text-sm font-medium transition-all duration-200
                            ${isActive(item.path)
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }
                        `}
                        aria-current={isActive(item.path) ? 'page' : undefined}
                    >
                        {getIcon(item.icon)}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
        );
    }

    return (
        <nav className="flex items-center gap-0.5 tablet8:gap-1 overflow-x-auto scrollbar-hide">
            {items.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`
            inline-flex items-center gap-1.5 tablet8:gap-2 
            px-2 tablet8:px-3 py-1.5 tablet8:py-2 
            rounded-md tablet8:rounded-lg
            text-xs tablet8:text-sm font-medium whitespace-nowrap
            transition-all duration-200
            ${isActive(item.path)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                        }
          `}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                >
                    {getIcon(item.icon)}
                    {/* i18n: translate(`menu.${item.name.toLowerCase().replace(' ', '_')}`) */}
                    <span className="hidden sm:inline">{item.name}</span>
                </Link>
            ))}
        </nav>
    );
};

export default RoleNavigation;
