# Backend Integration Guide: National Compliance Heatmap

This guide details how to connect the **National Compliance Overview** (Heatmap) to the backend.

## 1. Files Involved

*   **Service Layer**: `src/services/dashboardService.js`
    *   **Role**: Handles the actual HTTP request to the backend.
    *   **Action**: Defines the `getNationalCompliance()` function.
*   **Component Layer**: `src/components/dashboard/heatmap/ComplianceHeatmap.jsx`
    *   **Role**: Calls the service, manages loading states, and renders the map.
    *   **Action**: Uses `useEffect` to fetch data on mount.

## 2. API Endpoint Specification

The backend **MUST** expose the following endpoint:

*   **Method**: `GET`
*   **Endpoint**: `/api/dashboard/national-compliance`
    *   *Note: The `/api` prefix depends on your `VITE_API_BASE_URL` configuration.*

## 3. Expected Data Format (JSON Response)

The backend **MUST** return a JSON array of state objects. Each object represents a state's compliance data.

```json
[
  {
    "id": "AP",
    "state": "Andhra Pradesh",
    "compliance": 85,
    "violations": 45,
    "status": "Moderate",
    "flaggedSellers": 8,
    "violationBreakdown": [
      { "type": "Missing MRP Text", "count": 18 },
      { "type": "No Country of Origin", "count": 13 },
      { "type": "Incorrect Net Quantity", "count": 9 },
      { "type": "Other", "count": 5 }
    ]
  },
  {
    "id": "MH",
    "state": "Maharashtra",
    "compliance": 63,
    "violations": 120,
    "status": "Risk",
    "flaggedSellers": 20,
    "violationBreakdown": [
      { "type": "Missing MRP Text", "count": 48 },
      { "type": "No Country of Origin", "count": 36 },
      { "type": "Incorrect Net Quantity", "count": 24 },
      { "type": "Other", "count": 12 }
    ]
  }
  // ... repeat for all states
]
```

### Field Descriptions:
*   `id`: State code (e.g., "AP", "MH", "DL"). Must match the keys in `india-states.json`.
*   `state`: Full state name.
*   `compliance`: Integer (0-100).
*   `violations`: Total number of active violations.
*   `status`: String ("Good", "Moderate", "Risk", "Critical").
*   `flaggedSellers`: Number of sellers flagged for violations.
*   `violationBreakdown`: Array of objects detailing specific violation types.

## 4. Integration Steps

### Step 1: Verify Service Method
Ensure `src/services/dashboardService.js` has this method:

```javascript
// src/services/dashboardService.js

export const dashboardService = {
    // ... other methods
    
    /**
     * Get national compliance heatmap data
     * @returns {Promise<Array>}
     */
    getNationalCompliance: async () => {
        return apiRequest('/dashboard/national-compliance');
    }
};
```

### Step 2: Remove Dummy Data
In `src/components/dashboard/heatmap/ComplianceHeatmap.jsx`, locate the `useEffect` hook responsible for data fetching.

**Current Code (with Fallback):**
```javascript
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Attempt to fetch from backend
                const response = await dashboardService.getNationalCompliance();
                if (response && Array.isArray(response)) {
                     setData(response);
                } else {
                    throw new Error("Invalid response format");
                }
               
            } catch (error) {
                console.error("Failed to fetch national compliance data:", error);
                
                // --- DELETE FROM HERE ---
                // Fallback to Mock Data if backend fails
                const generateMockData = () => {
                    // ... long list of dummy states ...
                };
                const mockResponse = generateMockData();
                setData(mockResponse);
                // --- TO HERE ---
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
```

**Final Production Code (After Backend is Ready):**
When the backend is live and stable, remove the entire `catch` block logic that generates mock data. The final code should look like this:

```javascript
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await dashboardService.getNationalCompliance();
                setData(response);
            } catch (error) {
                console.error("Failed to fetch national compliance data:", error);
                // Optionally set an error state to show a UI message
                // setError("Failed to load map data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
```

## 5. Required Code Comments

Add these comments in `ComplianceHeatmap.jsx` to guide future developers:

```javascript
// TODO: Fetch this data from backend (API endpoint: /dashboard/national-compliance)
// Expected backend response:
// [
//   { 
//     id: "AP", 
//     state: "Andhra Pradesh", 
//     compliance: 85, 
//     violations: 45, 
//     status: "Moderate",
//     flaggedSellers: 8,
//     violationBreakdown: [
//       { type: "Missing MRP Text", count: 18 },
//       ...
//     ]
//   },
//   ...
// ]
```
