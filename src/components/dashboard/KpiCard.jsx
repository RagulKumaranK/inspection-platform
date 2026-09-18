import React from 'react';

const KpiCard = ({
    title,
    value,
    trend, // 'up' | 'down' | 'neutral'
    trendValue, // e.g., "+12.5%"
    icon,
    color = 'blue' // 'blue' | 'cyan' | 'amber' | 'rose'
}) => {
    // Color configurations for the premium look
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-800',
            iconText: 'text-blue-600 dark:text-blue-300',
            trendUp: 'text-blue-600 dark:text-blue-400',
        },
        cyan: {
            bg: 'bg-cyan-50 dark:bg-cyan-900/20',
            border: 'border-cyan-100 dark:border-cyan-800',
            text: 'text-cyan-600 dark:text-cyan-400',
            iconBg: 'bg-cyan-100 dark:bg-cyan-800',
            iconText: 'text-cyan-600 dark:text-cyan-300',
            trendUp: 'text-cyan-600 dark:text-cyan-400',
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800',
            text: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-100 dark:bg-amber-800',
            iconText: 'text-amber-600 dark:text-amber-300',
            trendUp: 'text-amber-600 dark:text-amber-400',
        },
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-900/20',
            border: 'border-rose-100 dark:border-rose-800',
            text: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-100 dark:bg-rose-800',
            iconText: 'text-rose-600 dark:text-rose-300',
            trendUp: 'text-rose-600 dark:text-rose-400',
        },
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
        <div className={`
            relative overflow-hidden
            bg-white dark:bg-gray-800 
            border border-gray-100 dark:border-gray-700
            rounded-xl p-6
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1
            group
        `}>
            {/* Decorative background accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16 transition-transform group-hover:scale-110 ${styles.bg.replace('bg-', 'bg-')}`}></div>

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {value}
                    </h3>

                    {/* Trend Indicator */}
                    {(trend && trendValue) && (
                        <div className="flex items-center mt-2 space-x-2">
                            <span className={`
                                text-xs font-semibold px-2 py-0.5 rounded-full
                                ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                ${trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                                ${trend === 'neutral' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                            `}>
                                {trend === 'up' && '↑'}
                                {trend === 'down' && '↓'}
                                {trend === 'neutral' && '•'}
                                {' '}{trendValue}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">vs last month</span>
                        </div>
                    )}
                </div>

                {/* Icon Circle */}
                <div className={`
                    p-3 rounded-xl
                    ${styles.iconBg} ${styles.iconText}
                    shadow-sm
                `}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default KpiCard;
