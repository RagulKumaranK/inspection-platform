import React from 'react';
import Header from '../../components/dashboard/Header';
import DashboardStats from '../../components/dashboard/DashboardStats';
import ViolationBreakdown from '../../components/dashboard/ViolationBreakdown';
import ComplianceByCategory from '../../components/dashboard/ComplianceByCategory';
import ComplianceTrendsChart from '../../components/dashboard/ComplianceTrendsChart';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header role="admin" />

            <main className="max-w-7xl mx-auto px-4 py-6 tablet8:px-6 tablet8:py-8">
                {/* KPI Stats Section */}
                <DashboardStats role="admin" />

                {/* Compliance Sections */}
                <div className="mt-6 tablet8:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 tablet8:gap-6">
                    {/* Violation Breakdown Chart */}
                    <ViolationBreakdown role="admin" />

                    {/* Compliance by Category */}
                    <ComplianceByCategory role="admin" />
                </div>

                {/* Compliance Trends Chart */}
                <div className="mt-6 tablet8:mt-8">
                    <ComplianceTrendsChart />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
