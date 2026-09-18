import React from 'react';

const PlatformCard = ({
    name,
    count,
    icon,
    trend, // 'up' | 'down' | 'neutral'
    trendValue, // e.g. "+12%"
    color = 'blue',
    onClick
}) => {
    // Color configurations for the icon background
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400',
        },
        cyan: {
            bg: 'bg-cyan-50 dark:bg-cyan-900/20',
            text: 'text-cyan-600 dark:text-cyan-400',
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-600 dark:text-amber-400',
        },
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            text: 'text-rose-600 dark:text-rose-400',
        },
        gray: {
            bg: 'bg-gray-50 dark:bg-gray-800',
            text: 'text-gray-600 dark:text-gray-400',
        }
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
        <div
            className="
                flex items-center p-5
                bg-white dark:bg-gray-800 
                border border-gray-100 dark:border-gray-700 
                rounded-xl
                shadow-sm hover:shadow-md
                transition-all duration-200 
                cursor-pointer
                group
            "
            onClick={onClick}
        >
            {/* Icon Container */}
            <div className={`
                flex-shrink-0 
                w-12 h-12
                flex items-center justify-center 
                rounded-xl
                ${styles.bg} ${styles.text}
                mr-4
                transition-transform group-hover:scale-105
            `}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-0.5">
                    {name}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {count}
                    </p>
                    {trend && trendValue && (
                        <span className={`
                            text-xs font-medium flex items-center
                            ${trend === 'up' ? 'text-green-600 dark:text-green-400' : ''}
                            ${trend === 'down' ? 'text-red-600 dark:text-red-400' : ''}
                            ${trend === 'neutral' ? 'text-gray-500' : ''}
                        `}>
                            {trend === 'up' && '↑'}
                            {trend === 'down' && '↓'}
                            {trendValue}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlatformCard;
