import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';

const ViolationBreakdown = ({ role }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchViolations = async () => {
            setLoading(true);
            setError(null);
            try {
                // TODO: Fetch this data from backend (API endpoint: /dashboard/violation-breakdown)
                // Expected backend response:
                // {
                //   success: true,
                //   violations: [
                //     { type: "Missing MRP Text", count: 120, percentage: 24 },
                //     { type: "No Country of Origin", count: 95, percentage: 19 },
                //     ...
                //   ]
                // }

                // Attempt to fetch from backend
                const response = await dashboardService.getViolationBreakdown();

                let violationsData = [];
                if (response && response.violations) {
                    violationsData = response.violations;
                } else if (Array.isArray(response)) {
                    // Handle case where API might return array directly
                    violationsData = response;
                } else {
                    // If response is invalid, throw error to trigger fallback
                    throw new Error("Invalid response format");
                }

                // Sort by percentage descending, but keep "Others" at the bottom
                const sortedData = violationsData.sort((a, b) => {
                    if (a.type === "Others") return 1;
                    if (b.type === "Others") return -1;
                    return b.percentage - a.percentage;
                });

                setData(sortedData);
                setLoading(false);

            } catch (err) {
                console.error('Error fetching violations:', err);

                // Fallback to Mock Data if backend fails (for development/demo)
                // TODO: Remove this fallback in production once backend is stable

                // TEMPORARY: Mock Data (Replace with GET /api/violations/summary)
                const mockResponse = {
                    success: true,
                    violations: [
                        { type: "Missing MRP Text", count: 120, percentage: 24 },
                        { type: "No Country of Origin", count: 95, percentage: 19 },
                        { type: "Incorrect Net Quantity", count: 30, percentage: 6 },
                        { type: "Missing Manufacturer Info", count: 140, percentage: 28 },
                        { type: "Invalid Date Format", count: 115, percentage: 23 },
                        { type: "Others", count: 45, percentage: 9 }
                    ]
                };

                // Sort by percentage descending, but keep "Others" at the bottom
                const sortedData = mockResponse.violations.sort((a, b) => {
                    if (a.type === "Others") return 1;
                    if (b.type === "Others") return -1;
                    return b.percentage - a.percentage;
                });

                setData(sortedData);
                setLoading(false);
                // In production, you might want to set error state instead:
                // setError('Failed to load violation data');
            }
        };

        fetchViolations();
    }, [role]);

    // Helper: Determine bar color based on severity (Modern Flat Colors)
    const getBarColor = (percentage) => {
        if (percentage <= 15) return 'bg-emerald-500'; // Low Severity
        if (percentage <= 50) return 'bg-amber-500';   // Medium Severity
        return 'bg-rose-500';    // High Severity
    };

    // Check if fully compliant
    const isFullyCompliant = !loading && !error && data.every(item => item.percentage === 0);

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm h-full flex flex-col justify-center items-center">
                <p className="text-rose-500 text-sm font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    Violation Breakdown
                </h2>
                {!loading && !isFullyCompliant && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md border border-gray-100 dark:border-gray-600">
                        Top Issues
                    </span>
                )}
            </div>

            <div className="flex-1 w-full overflow-y-auto pr-2 scrollbar-hide">
                {loading ? (
                    <div className="h-full w-full flex flex-col items-center justify-center space-y-3 min-h-[200px]">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-medium text-gray-400">Loading data...</p>
                    </div>
                ) : isFullyCompliant ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 min-h-[200px]">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Fully Compliant
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            No violations detected.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-7">
                        {data.map((item, index) => (
                            <div key={index} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-[75%] group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                        {item.type}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                                        {item.percentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${getBarColor(item.percentage)}`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViolationBreakdown;
