import React, { useState } from 'react';
import DashboardStats from '../../components/dashboard/DashboardStats';
import ViolationBreakdown from '../../components/dashboard/ViolationBreakdown';
import ComplianceByCategory from '../../components/dashboard/ComplianceByCategory';
import ComplianceTrendsChart from '../../components/dashboard/ComplianceTrendsChart';
import ComplianceHeatmap from '../../components/dashboard/heatmap/ComplianceHeatmap';


const OfficerDashboard = () => {


    // BACKEND INTEGRATION: This is the main dashboard container.
    // Data fetching logic resides within individual child components:
    // - DashboardStats: Fetches KPI metrics
    // - ComplianceHeatmap: Fetches state-wise compliance data
    // - ViolationBreakdown: Fetches violation type distribution
    // - ComplianceByCategory: Fetches category-wise compliance
    // - ComplianceTrendsChart: Fetches historical trend data

    return (
        <main className="max-w-7xl mx-auto px-4 py-6 tablet8:px-6 tablet8:py-8 relative">
            {/* KPI Stats Section */}
            <DashboardStats role="officer" />

            {/* India Compliance Heatmap */}
            <div className="mt-6 tablet8:mt-8 h-[700px] tablet8:h-[850px]">
                <ComplianceHeatmap />
            </div>

            {/* Compliance Sections */}
            <div className="mt-6 tablet8:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 tablet8:gap-6">
                {/* Violation Breakdown Chart */}
                <ViolationBreakdown role="officer" />

                {/* Compliance by Category */}
                <ComplianceByCategory role="officer" />
            </div>

            {/* Compliance Trends Chart */}
            <div className="mt-6 tablet8:mt-8">
                <ComplianceTrendsChart />
            </div>

        </main>
    );
};

export default OfficerDashboard;
