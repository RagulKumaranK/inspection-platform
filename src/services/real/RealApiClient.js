/**
 * Real Implementation Production API Client
 * Interfaces directly with Python FastAPI backend pipeline endpoints.
 * Completely separate from the current frontend demo mock data pipeline.
 */

const BACKEND_BASE_URL = import.meta.env.VITE_REAL_BACKEND_URL || 'http://localhost:8000/api/v1';

export class RealApiClient {
    constructor(baseUrl = BACKEND_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Executes generic authenticated HTTP request to real backend.
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('realAuthToken') && {
                'Authorization': `Bearer ${localStorage.getItem('realAuthToken')}`
            })
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`[RealApiClient] Request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Post complete scan image for end-to-end processing across all 15 pipeline modules.
     */
    async processFullScan(payload) {
        return this.request('/pipeline/process-full-scan', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    /**
     * Post frame for instant quality check.
     */
    async checkImageQuality(payload) {
        return this.request('/pipeline/evaluate-image-quality', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    /**
     * Post frame for ArUco calibration and font height measurement.
     */
    async calibrateAndMeasure(payload) {
        return this.request('/pipeline/calibrate-and-measure', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
}

export const realApiClient = new RealApiClient();
