import React, { useState, useEffect } from 'react';
import KpiCard from './KpiCard';
import { dashboardService } from '../../services/dashboardService';

const DashboardStats = ({ role }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                // TODO: Fetch this data from backend (API endpoint: /dashboard/metrics)
                // Expected backend response:
                // {
                //   productsScanned: number,
                //   complianceRate: string (e.g., "94.2%"),
                //   pendingReviews: number,
                //   activeViolations: number,
                //   monitoredPlatforms: number
                // }

                // const data = await dashboardService.getStats(role);

                // TEMPORARY: Mock data until backend is connected
                const data = {
                    productsScanned: 12450,
                    complianceRate: '94.2%',
                    pendingReviews: 45,
                    activeViolations: 12,
                    monitoredPlatforms: 8
                };

                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [role]);

    // Icons for each KPI
    const icons = {
        products: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        compliance: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        pending: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        alert: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tablet8:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse h-40">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tablet8:gap-6">
                {/* Total Products (Blue) */}
                <KpiCard
                    title="Total Products"
                    value={stats?.productsScanned?.toLocaleString() || '12,450'}
                    trend="up"
                    trendValue="+12.5%"
                    icon={icons.products}
                    color="blue"
                />

                {/* Compliance Rate (Cyan) */}
                <KpiCard
                    title="Compliance Rate"
                    value={stats?.complianceRate || '94.2%'}
                    trend="up"
                    trendValue="+2.4%"
                    icon={icons.compliance}
                    color="cyan"
                />

                {/* Pending Reviews (Amber) */}
                <KpiCard
                    title="Pending Reviews"
                    value={stats?.pendingReviews?.toLocaleString() || '45'}
                    trend="down"
                    trendValue="-5.0%"
                    icon={icons.pending}
                    color="amber"
                />

                {/* Active Violations (Rose) */}
                <KpiCard
                    title="Active Violations"
                    value={stats?.activeViolations?.toLocaleString() || '12'}
                    trend="down"
                    trendValue="-14.2%"
                    icon={icons.alert}
                    color="rose"
                />
            </div>
        </div>
    );
};

export default DashboardStats;
