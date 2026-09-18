const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper to handle common API logic
 * @param {string} endpoint - API endpoint (e.g., '/dashboard/stats')
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - JSON response
 */
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        // Add Authorization header if token exists
        ...(localStorage.getItem('authToken') && {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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

        // Handle 401 Unauthorized (e.g., redirect to login)
        if (response.status === 401) {
            // Optional: Dispatch a logout event or clear storage
            // localStorage.removeItem('authToken');
            // window.location.href = '/login';
            console.warn('Unauthorized access. Token may be invalid.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Request failed for ${endpoint}:`, error);
        throw error;
    }
};
