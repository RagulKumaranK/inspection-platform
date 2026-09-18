import { apiRequest } from './api';

export const dashboardService = {
    /**
     * Get main dashboard statistics
     * @param {string} role - User role (optional filter)
     * @returns {Promise<object>}
     */
    getStats: async (role) => {
        const query = role ? `?role=${role}` : '';
        return apiRequest(`/dashboard/stats${query}`);
    },

    /**
     * Get compliance score data
     * @returns {Promise<object>}
     */
    getComplianceScore: async () => {
        return apiRequest('/dashboard/compliance-score');
    },

    /**
     * Get compliance breakdown by category
     * @returns {Promise<object>}
     */
    getComplianceByCategory: async () => {
        return apiRequest('/dashboard/compliance-by-category');
    },

    /**
     * Get national compliance heatmap data
     * @returns {Promise<Array>}
     */
    getNationalCompliance: async () => {
        return apiRequest('/dashboard/national-compliance');
    },

    /**
     * Get violation breakdown data
     * @returns {Promise<object>}
     */
    getViolationBreakdown: async () => {
        return apiRequest('/dashboard/violation-breakdown');
    },

    /**
     * Get compliance trends data
     * @param {string} range - Time range ('week', 'month', 'quarter')
     * @param {number} month - Selected month index (0-11)
     * @param {number} year - Selected year
     * @returns {Promise<Array>}
     */
    getComplianceTrends: async (range, month, year) => {
        const query = `?range=${range}&month=${month}&year=${year}`;
        return apiRequest(`/dashboard/compliance-trends${query}`);
    },

    /**
     * Get platform analytics data
     * @returns {Promise<object>}
     */
    getPlatformAnalytics: async () => {
        return apiRequest('/dashboard/platform-analytics');
    },

    // --- Scanning & Monitoring APIs ---

    /**
     * Start Live Marketplace Monitoring
     * @returns {Promise<object>}
     */
    startLiveMonitoring: async (count) => {
        return apiRequest('/scan/live-marketplace', {
            method: 'POST',
            body: JSON.stringify({
                mode: 'live',
                input: { count }
            })
        });
    },

    /**
     * Stop Live Marketplace Monitoring
     * @returns {Promise<object>}
     */
    stopLiveMonitoring: async () => {
        return apiRequest('/scanning/live/stop', { method: 'POST' });
    },

    /**
     * Start Category-Wise Monitoring
     * @param {string} platform 
     * @param {string} categoryId 
     * @param {string} duration 
     * @returns {Promise<object>}
     */
    startCategoryScan: async (platform, categoryId, duration, count) => {
        return apiRequest('/scan/category', {
            method: 'POST',
            body: JSON.stringify({
                mode: 'category',
                input: {
                    platform,
                    category: categoryId,
                    duration,
                    count
                }
            })
        });
    },

    /**
     * Start Bulk Product Monitoring
     * @param {string} platform 
     * @param {string} categoryId 
     * @param {number} count 
     * @returns {Promise<object>}
     */
    startBulkScan: async (platform, categoryId, count) => {
        return apiRequest('/scan/bulk', {
            method: 'POST',
            body: JSON.stringify({
                mode: 'bulk',
                input: {
                    platform,
                    category: categoryId,
                    count
                }
            })
        });
    },

    /**
     * Perform One Product Instant Scan
     * @param {string} url 
     * @returns {Promise<object>}
     */
    instantScan: async (url) => {
        return apiRequest('/scan/single', {
            method: 'POST',
            body: JSON.stringify({
                mode: 'single',
                input: { url }
            })
        });
    },

    // --- Scan Product Page APIs ---

    /**
     * Analyze scanned product image/barcode
     * @param {object} data - { image: base64, barcode: string }
     * @returns {Promise<object>}
     */
    analyzeScan: async (data) => {
        return apiRequest('/scan/analyze', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * Save scan result
     * @param {object} data - { scanData, complianceResult, officerId, location, timestamp }
     * @returns {Promise<object>}
     */
    saveScanResult: async (data) => {
        return apiRequest('/scan/save', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // --- Reports Page APIs ---

    /**
     * Get violation reports with filters
     * @param {object} filters - { search, platform, risk, page, limit }
     * @returns {Promise<object>}
     */
    getViolationReports: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiRequest(`/reports?${queryParams}`);
    },

    /**
     * Download a specific report
     * @param {string} reportId 
     * @returns {Promise<Blob>}
     */
    downloadReport: async (reportId) => {
        // Note: For file downloads, we might need a different handling if apiRequest expects JSON
        // But assuming apiRequest handles it or we use fetch directly for blobs
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/${reportId}/download`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Download failed');
        return response.blob();
    },

    /**
     * Export all reports matching filters
     * @param {object} filters 
     * @returns {Promise<Blob>}
     */
    exportAllReports: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/export?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Export failed');
        return response.blob();
    }
};
