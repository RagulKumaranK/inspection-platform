import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services/dashboardService';

const ComplianceByCategory = ({ role }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extended Professional Color Palette for 12 Categories
    const COLORS = [
        '#2563EB', // Royal Blue
        '#059669', // Emerald Green
        '#D97706', // Amber
        '#DC2626', // Red
        '#7C3AED', // Violet
        '#DB2777', // Pink
        '#0891B2', // Cyan
        '#4F46E5', // Indigo
        '#EA580C', // Orange
        '#65A30D', // Lime
        '#9333EA', // Purple
        '#CA8A04'  // Yellow-Gold
    ];

    useEffect(() => {
        // Compliance Donut Chart Data Source:
        // Fetch category-wise compliance values from the backend compliance API.
        // API returns an array of categories with their compliance percentages.
        // Frontend must map these values directly into the donut chart segments.

        const fetchComplianceByCategory = async () => {
            try {
                // TODO: Fetch this data from backend (API endpoint: /dashboard/compliance-by-category)
                // Expected backend response:
                // [
                //   { name: 'Grocery', value: 15 },
                //   { name: 'Beauty', value: 8 },
                //   ...
                // ]

                // Attempt to fetch from backend
                const response = await dashboardService.getComplianceByCategory();

                if (Array.isArray(response)) {
                    setData(response);
                } else {
                    throw new Error("Invalid response format");
                }
                setLoading(false);

            } catch (err) {
                console.error('Error fetching compliance by category:', err);

                // Fallback to Mock Data if backend fails (for development/demo)
                // TODO: Remove this fallback in production once backend is stable

                // TEMPORARY: Dummy data representing a full 100% split across 12 categories
                const dummyData = [
                    { name: 'Grocery', value: 15 },
                    { name: 'Beauty', value: 8 },
                    { name: 'Home & Kitchen', value: 10 },
                    { name: 'Electronics', value: 12 },
                    { name: 'Fashion', value: 10 },
                    { name: 'Dairy', value: 5 },
                    { name: 'Personal Care', value: 8 },
                    { name: 'Gourmet', value: 5 },
                    { name: 'Skincare', value: 7 },
                    { name: 'Makeup', value: 6 },
                    { name: 'Haircare', value: 6 },
                    { name: 'Fragrance', value: 8 },
                ];
                setData(dummyData);
                setLoading(false);
                // In production, you might want to set error state instead:
                // setError('Failed to load category compliance data');
            }
        };

        fetchComplianceByCategory();
    }, [role]);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Only show label if percentage is significant enough to fit
        if (percent < 0.04) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-bold pointer-events-none drop-shadow-md"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full flex flex-col justify-center items-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-left">Compliance by Category</h2>
                <div className="flex items-center justify-center h-64 animate-pulse">
                    <div className="w-48 h-48 rounded-full border-8 border-gray-100 dark:border-gray-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left">Compliance by Category</h2>

            <div className="flex-1 min-h-[350px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={130}
                            innerRadius={85}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={2}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#1f2937', fontSize: '12px', fontWeight: '600' }}
                            cursor={false}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={60}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span className="text-xs font-medium text-gray-600 dark:text-gray-300 ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ComplianceByCategory;
