import React from 'react';
import PlatformAnalytics from '../../components/dashboard/PlatformAnalytics';
import ScanningConfiguration from '../../components/dashboard/ScanningConfiguration';

const PlatformAnalyticsPage = () => {
    // BACKEND INTEGRATION: This page aggregates platform-specific data.
    // Data fetching logic resides within:
    // - PlatformAnalytics: Fetches compliance scores per platform (Amazon, Flipkart, etc.)
    // - ScanningConfiguration: Fetches/Updates scraper settings
    return (
        <main className="max-w-7xl mx-auto px-4 py-6 tablet8:px-6 tablet8:py-8">
            <PlatformAnalytics role="officer" />
            <ScanningConfiguration />
        </main>
    );
};

export default PlatformAnalyticsPage;
