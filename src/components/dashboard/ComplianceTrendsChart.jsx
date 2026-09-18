import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { dashboardService } from '../../services/dashboardService';

const ComplianceTrendsChart = () => {
    const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'quarter'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Month & Year Selection
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // Generate list of years (e.g., current year - 4 to current year)
    const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

    // Helper: Get days in a specific month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };
    // Helper: Get month name
    const getMonthName = (monthIndex) => {
        return new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
    };

    // Color logic based on value (Enterprise Palette)
    const getBarColor = (value) => {
        if (value <= 50) return '#F43F5E'; // Rose-500 (Critical)
        if (value <= 80) return '#F59E0B'; // Amber-500 (Warning)
        return '#10B981'; // Emerald-500 (Good)
    };

    const getStatusLabel = (value) => {
        if (value <= 50) return 'Critical';
        if (value <= 80) return 'Warning';
        return 'Good';
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // TODO: Fetch this data from backend (API endpoint: /dashboard/compliance-trends)
                // Query Params: ?range={timeRange}&month={selectedMonth}&year={selectedYear}
                // Expected backend response:
                // [
                //   { label: "Mon", fullDate: "12/01/2025", value: 85 },
                //   { label: "Tue", fullDate: "12/02/2025", value: 92 },
                //   ...
                // ]

                // Attempt to fetch from backend
                const response = await dashboardService.getComplianceTrends(timeRange, selectedMonth, selectedYear);

                if (Array.isArray(response)) {
                    setData(response);
                } else {
                    throw new Error("Invalid response format");
                }
                setLoading(false);

            } catch (err) {
                console.error("Error fetching compliance trends:", err);

                // Fallback to Mock Data if backend fails (for development/demo)
                // TODO: Remove this fallback in production once backend is stable

                // TEMPORARY: Mock Data Generation
                let mockData = [];

                if (timeRange === 'week') {
                    // Last 7 days dynamic generation
                    const today = new Date();
                    mockData = Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(today.getDate() - (6 - i));
                        return {
                            label: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
                            fullDate: d.toLocaleDateString(),
                            value: Math.floor(Math.random() * 30) + 70 // Random 70-100
                        };
                    });

                } else if (timeRange === 'month') {
                    // Dynamic days based on selected month/year
                    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

                    mockData = Array.from({ length: daysInMonth }, (_, i) => ({
                        label: `${i + 1}`, // Just the number "1", "2" for cleaner axis
                        fullDate: `${getMonthName(selectedMonth)} ${i + 1}, ${selectedYear}`,
                        value: Math.floor(Math.random() * 60) + 40 // Random 40-100
                    }));

                } else if (timeRange === 'quarter') {
                    // 12 Weeks
                    mockData = Array.from({ length: 12 }, (_, i) => ({
                        label: `W${i + 1}`,
                        fullDate: `Week ${i + 1} of Quarter`,
                        value: Math.floor(Math.random() * 40) + 60 // Random 60-100
                    }));
                }

                setData(mockData);
                setLoading(false);
                // In production, you might want to set error state instead:
                // setError("Failed to load chart data");
            }
        };

        fetchData();
    }, [timeRange, selectedMonth, selectedYear]);

    // Handle Download Report
    const handleDownload = () => {
        if (!data || data.length === 0) return;

        // 1. Convert data to CSV
        const headers = ['Date/Label', 'Full Date', 'Compliance Score (%)', 'Status'];
        const csvRows = [headers.join(',')];

        data.forEach(row => {
            const status = getStatusLabel(row.value);
            const values = [
                row.label,
                row.fullDate || row.label,
                row.value,
                status
            ];
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');

        // 2. Create a Blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // 3. Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);

        // 4. Generate dynamic filename
        const timestamp = new Date().toISOString().split('T')[0];
        let filename = `compliance_report_${timeRange}_${timestamp}.csv`;

        if (timeRange === 'month') {
            filename = `compliance_report_${getMonthName(selectedMonth)}_${selectedYear}.csv`;
        } else if (timeRange === 'quarter') {
            filename = `compliance_report_quarterly_${selectedYear}.csv`;
        }

        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            const value = payload[0].value;
            const status = getStatusLabel(value);
            const color = getBarColor(value);

            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 min-w-[140px]">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {dataPoint.fullDate || label}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}%</span>
                    </div>
                    <p className="text-[10px] font-medium mt-0.5 uppercase tracking-wide" style={{ color }}>
                        {status}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                        Compliance Trends
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
                        </span>

                        {/* Month & Year Selectors */}
                        {(timeRange === 'month' || timeRange === 'quarter') && (
                            <div className="flex items-center gap-2 ml-1">
                                {/* Month Selector - Only for Month view */}
                                {timeRange === 'month' && (
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="text-xs border-none bg-transparent text-gray-600 dark:text-gray-300 font-medium focus:ring-0 cursor-pointer hover:text-primary-600 p-0"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {getMonthName(i)}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* Year Selector - For Month and Quarter views */}
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-xs border-none bg-transparent text-gray-600 dark:text-gray-300 font-medium focus:ring-0 cursor-pointer hover:text-primary-600 p-0"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        disabled={loading || data.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        title="Download CSV Report"
                    >
                        <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                    </button>

                    {/* View Switcher */}
                    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
                        {['week', 'month', 'quarter'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`
                                    px-3 py-1 text-xs font-medium rounded-md transition-all duration-200
                                    ${timeRange === range
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }
                                `}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-lg animate-pulse">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-2"></div>
                            <p className="text-sm text-gray-500">Loading trends...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                        <p className="text-rose-500 text-sm font-medium">{error}</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                        <p className="text-gray-500 text-sm">No data available for selected range</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                            barSize={timeRange === 'month' ? 8 : 24}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" className="dark:stroke-gray-700/50" />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                                dy={10}
                                interval={timeRange === 'month' ? 2 : 0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(243, 244, 246, 0.4)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default ComplianceTrendsChart;
