import React, { useState, useEffect, useRef } from 'react';
import PlatformCard from './PlatformCard';

import amazonLogo from '../../img/amazon.png';
import flipkartLogo from '../../img/Flipkart.png';
import jiomartLogo from '../../img/jiomart.png';
import myntraLogo from '../../img/myntra.png';

import { dashboardService } from '../../services/dashboardService';

const PlatformAnalytics = ({ role }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    // Simulated log data
    const logTemplates = [
        { type: 'info', msg: 'Scanning Amazon product page: https://amazon.in/dp/B08L5...' },
        { type: 'success', msg: 'Successfully extracted price data: ₹1,499' },
        { type: 'info', msg: 'Checking compliance rules for "Country of Origin"...' },
        { type: 'warning', msg: 'Potential violation detected: Missing "Best Before" date' },
        { type: 'info', msg: 'Navigating to Flipkart category: Electronics > Mobiles' },
        { type: 'info', msg: 'Parsing DOM elements for JioMart listing...' },
        { type: 'success', msg: 'Data sync complete for Myntra batch #4021' },
        { type: 'success', msg: 'System check completed. Scraper active on 4 platforms.' },
    ];

    useEffect(() => {
        const fetchPlatformData = async () => {
            try {
                setLoading(true);
                // TODO: Fetch this data from backend (API endpoint: /dashboard/platform-analytics)
                // Expected backend response:
                // {
                //   platforms: [
                //     { id: 'amazon', name: 'Amazon', count: 4520, trend: 'up', trendValue: '+5.2%' },
                //     { id: 'flipkart', name: 'Flipkart', count: 3850, trend: 'up', trendValue: '+3.1%' },
                //     { id: 'jiomart', name: 'JioMart', count: 2100, trend: 'down', trendValue: '-1.2%' },
                //     { id: 'myntra', name: 'Myntra', count: 1980, trend: 'up', trendValue: '+8.5%' }
                //   ]
                // }

                // Attempt to fetch from backend
                const data = await dashboardService.getPlatformAnalytics();

                if (data && data.platforms) {
                    setStats(data);
                } else {
                    throw new Error("Invalid response format");
                }

            } catch (err) {
                console.error('Error fetching platform analytics:', err);

                // Fallback to Mock Data if backend fails (for development/demo)
                // TODO: Remove this fallback in production once backend is stable

                setStats({
                    platforms: [
                        { id: 'amazon', name: 'Amazon', count: 4520, trend: 'up', trendValue: '+5.2%', color: 'amber' },
                        { id: 'flipkart', name: 'Flipkart', count: 3850, trend: 'up', trendValue: '+3.1%', color: 'blue' },
                        { id: 'jiomart', name: 'JioMart', count: 2100, trend: 'down', trendValue: '-1.2%', color: 'rose' },
                        { id: 'myntra', name: 'Myntra', count: 1980, trend: 'up', trendValue: '+8.5%', color: 'rose' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPlatformData();
    }, [role]);

    // Log simulation effect
    useEffect(() => {
        const interval = setInterval(() => {
            const randomLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

            setLogs(prev => {
                const newLogs = [...prev, { ...randomLog, time: timestamp, id: Date.now() }];
                if (newLogs.length > 4) return newLogs.slice(newLogs.length - 4);
                return newLogs;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const icons = {
        amazon: (
            <img src={amazonLogo} alt="Amazon" className="w-full h-full object-contain p-2" />
        ),
        flipkart: (
            <img src={flipkartLogo} alt="Flipkart" className="w-full h-full object-contain p-2" />
        ),
        jiomart: (
            <img src={jiomartLogo} alt="JioMart" className="w-full h-full object-contain p-2" />
        ),
        myntra: (
            <img src={myntraLogo} alt="Myntra" className="w-full h-full object-contain p-2" />
        ),
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            default: return 'text-blue-300';
        }
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Platform Analytics
                    </h3>
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            Real-Time Monitoring
                        </span>
                    </div>
                </div>

                {/* Loading Skeleton for Terminal */}
                <div className="w-full bg-gray-900 rounded-lg p-4 mb-6 h-32 animate-pulse border border-gray-700"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tablet8:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 animate-pulse h-24">
                            <div className="flex items-center h-full">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mr-4"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Platform Analytics
                </h3>
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        Real-Time Monitoring
                    </span>
                </div>
            </div>

            {/* Live Terminal Log */}
            <div className="w-full bg-gray-900 rounded-lg p-3 mb-6 font-mono text-xs shadow-inner border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-500 ml-2 text-[10px] uppercase tracking-wider">scraper_node_v1.4.2 — /bin/bash</span>
                </div>
                <div className="space-y-1.5 min-h-[80px]">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-2 animate-fade-in">
                            <span className="text-gray-500 shrink-0">[{log.time}]</span>
                            <span className={`${getLogColor(log.type)} break-all`}>
                                <span className="mr-2">$</span>
                                {log.msg}
                            </span>
                        </div>
                    ))}
                    <div className="text-green-400 animate-pulse">_</div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tablet8:gap-6">
                {/* Amazon */}
                <PlatformCard
                    name="Amazon Scans"
                    count={stats?.platforms?.[0]?.count?.toLocaleString() || '4,520'}
                    trend={stats?.platforms?.[0]?.trend || 'up'}
                    trendValue={stats?.platforms?.[0]?.trendValue || '+5.2%'}
                    icon={icons.amazon}
                    color="amber"
                />

                {/* Flipkart */}
                <PlatformCard
                    name="Flipkart Scans"
                    count={stats?.platforms?.[1]?.count?.toLocaleString() || '3,850'}
                    trend={stats?.platforms?.[1]?.trend || 'up'}
                    trendValue={stats?.platforms?.[1]?.trendValue || '+3.1%'}
                    icon={icons.flipkart}
                    color="blue"
                />

                {/* JioMart */}
                <PlatformCard
                    name="JioMart Scans"
                    count={stats?.platforms?.[2]?.count?.toLocaleString() || '2,100'}
                    trend={stats?.platforms?.[2]?.trend || 'down'}
                    trendValue={stats?.platforms?.[2]?.trendValue || '-1.2%'}
                    icon={icons.jiomart}
                    color="rose"
                />

                {/* Myntra */}
                <PlatformCard
                    name="Myntra Scans"
                    count={stats?.platforms?.[3]?.count?.toLocaleString() || '1,980'}
                    trend={stats?.platforms?.[3]?.trend || 'up'}
                    trendValue={stats?.platforms?.[3]?.trendValue || '+8.5%'}
                    icon={icons.myntra}
                    color="rose"
                />
            </div>
        </div>
    );
};

export default PlatformAnalytics;
