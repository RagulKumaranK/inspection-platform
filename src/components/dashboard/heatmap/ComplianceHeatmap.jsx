import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Loader2, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardService } from '../../../services/dashboardService';

// India GeoJSON URL (Local)
const INDIA_GEO_JSON = "/india-states.json";

const ComplianceHeatmap = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltipContent, setTooltipContent] = useState("");
    const [selectedState, setSelectedState] = useState(null);

    const closeModal = () => setSelectedState(null);

    const handleStateClick = (stateData) => {
        setSelectedState(stateData);
    };

    // Lock Body Scroll when Modal is Open
    useEffect(() => {
        if (selectedState) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedState]);

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Attempt to fetch from backend
                // TODO: Fetch this data from backend (API endpoint: /dashboard/national-compliance)
                // Expected backend response:
                // [
                //   { 
                //     id: "AP", 
                //     state: "Andhra Pradesh", 
                //     compliance: 85, 
                //     violations: 45, 
                //     status: "Moderate",
                //     flaggedSellers: 8, // Calculated or from backend
                //     violationBreakdown: [
                //       { type: "Missing MRP Text", count: 18 },
                //       ...
                //     ]
                //   },
                //   ...
                // ]

                // Note: Since backend might not be running, this will likely fail and go to catch block
                const response = await dashboardService.getNationalCompliance();
                if (response && Array.isArray(response)) {
                    setData(response);
                } else {
                    throw new Error("Invalid response format");
                }

            } catch (error) {
                console.error("Failed to fetch national compliance data:", error);

                // Fallback to Mock Data if backend fails (for development/demo)
                // TODO: Remove this fallback in production once backend is stable
                const generateMockData = () => {
                    const states = [
                        { id: 'AP', state: 'Andhra Pradesh', compliance: 85, violations: 45, status: 'Moderate' },
                        { id: 'AR', state: 'Arunachal Pradesh', compliance: 92, violations: 5, status: 'Good' },
                        { id: 'AS', state: 'Assam', compliance: 78, violations: 67, status: 'Moderate' },
                        { id: 'BR', state: 'Bihar', compliance: 65, violations: 120, status: 'Risk' },
                        { id: 'CT', state: 'Chhattisgarh', compliance: 72, violations: 34, status: 'Moderate' },
                        { id: 'GA', state: 'Goa', compliance: 95, violations: 2, status: 'Good' },
                        { id: 'GJ', state: 'Gujarat', compliance: 88, violations: 25, status: 'Moderate' },
                        { id: 'HR', state: 'Haryana', compliance: 68, violations: 89, status: 'Risk' },
                        { id: 'HP', state: 'Himachal Pradesh', compliance: 91, violations: 12, status: 'Good' },
                        { id: 'JH', state: 'Jharkhand', compliance: 55, violations: 150, status: 'Risk' },
                        { id: 'KA', state: 'Karnataka', compliance: 82, violations: 56, status: 'Moderate' },
                        { id: 'KL', state: 'Kerala', compliance: 96, violations: 8, status: 'Good' },
                        { id: 'MP', state: 'Madhya Pradesh', compliance: 62, violations: 110, status: 'Risk' },
                        { id: 'MH', state: 'Maharashtra', compliance: 63, violations: 120, status: 'Risk' },
                        { id: 'MN', state: 'Manipur', compliance: 75, violations: 20, status: 'Moderate' },
                        { id: 'ML', state: 'Meghalaya', compliance: 80, violations: 15, status: 'Moderate' },
                        { id: 'MZ', state: 'Mizoram', compliance: 85, violations: 10, status: 'Moderate' },
                        { id: 'NL', state: 'Nagaland', compliance: 70, violations: 22, status: 'Moderate' },
                        { id: 'OR', state: 'Odisha', compliance: 74, violations: 40, status: 'Moderate' },
                        { id: 'PB', state: 'Punjab', compliance: 58, violations: 95, status: 'Risk' },
                        { id: 'RJ', state: 'Rajasthan', compliance: 66, violations: 105, status: 'Risk' },
                        { id: 'SK', state: 'Sikkim', compliance: 94, violations: 3, status: 'Good' },
                        { id: 'TN', state: 'Tamil Nadu', compliance: 91, violations: 14, status: 'Good' },
                        { id: 'TG', state: 'Telangana', compliance: 84, violations: 38, status: 'Moderate' },
                        { id: 'TR', state: 'Tripura', compliance: 79, violations: 18, status: 'Moderate' },
                        { id: 'UP', state: 'Uttar Pradesh', compliance: 45, violations: 250, status: 'Critical' },
                        { id: 'UT', state: 'Uttarakhand', compliance: 88, violations: 20, status: 'Moderate' },
                        { id: 'WB', state: 'West Bengal', compliance: 52, violations: 180, status: 'Risk' },
                        { id: 'DL', state: 'NCT of Delhi', compliance: 70, violations: 150, status: 'Moderate' },
                        { id: 'JK', state: 'Jammu and Kashmir', compliance: 60, violations: 80, status: 'Risk' },
                        { id: 'LA', state: 'Ladakh', compliance: 85, violations: 5, status: 'Moderate' },
                        { id: 'LD', state: 'Lakshadweep', compliance: 98, violations: 0, status: 'Good' },
                        { id: 'PY', state: 'Puducherry', compliance: 89, violations: 10, status: 'Moderate' },
                        { id: 'AN', state: 'Andaman and Nicobar', compliance: 95, violations: 1, status: 'Good' },
                        { id: 'CH', state: 'Chandigarh', compliance: 82, violations: 15, status: 'Moderate' },
                        { id: 'DN', state: 'Dadra and Nagar Haveli', compliance: 78, violations: 8, status: 'Moderate' },
                        { id: 'DD', state: 'Daman and Diu', compliance: 76, violations: 5, status: 'Moderate' }
                    ];

                    return states.map(s => ({
                        ...s,
                        flaggedSellers: Math.floor(s.violations * 0.15) + 2,
                        violationBreakdown: [
                            { type: 'Missing MRP Text', count: Math.floor(s.violations * 0.4) },
                            { type: 'No Country of Origin', count: Math.floor(s.violations * 0.3) },
                            { type: 'Incorrect Net Quantity', count: Math.floor(s.violations * 0.2) },
                            { type: 'Other', count: Math.floor(s.violations * 0.1) }
                        ]
                    }));
                };

                const mockResponse = generateMockData();
                setData(mockResponse);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Color Scale Logic
    const colorScale = (compliance) => {
        if (compliance >= 90) return '#1b5e20'; // Dark Green (Fully Compliant)
        if (compliance >= 70) return '#fbc02d'; // Amber (Moderate)
        if (compliance >= 50) return '#fb8c00'; // Orange (High Risk)
        return '#c62828'; // Red (Critical)
    };

    // Filter Top 5 Non-Compliant States
    const top5NonCompliant = useMemo(() => {
        return [...data].sort((a, b) => a.compliance - b.compliance).slice(0, 5);
    }, [data]);

    const handleMouseEnter = useCallback((geo) => {
        const stateName = geo.properties.NAME_1;
        const stateData = data.find(s => s.state === stateName || stateName.includes(s.state) || s.state.includes(stateName));
        const isTop5 = top5NonCompliant.find(s => s.state === stateData?.state);

        if (stateData) {
            setTooltipContent(`
                <div class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-none font-sans">
                    <p class="font-bold text-sm mb-2 text-gray-900 dark:text-gray-100 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 pb-1">${stateData.state}</p>
                    <div class="space-y-1">
                        <div class="flex justify-between items-center gap-4">
                            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Compliance</span>
                            <span class="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">${stateData.compliance}%</span>
                        </div>
                        <div class="flex justify-between items-center gap-4">
                            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Violations</span>
                            <span class="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">${stateData.violations}</span>
                        </div>
                        ${isTop5 ? `
                        <div class="mt-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                            <span class="text-[10px] font-bold text-red-600 uppercase tracking-wider">⚠ Priority Focus</span>
                        </div>` : `
                        <div class="mt-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                            <span class="text-[10px] font-bold text-green-600 uppercase tracking-wider">✔ Compliant</span>
                        </div>`}
                    </div>
                </div>
            `);
        } else {
            setTooltipContent("");
        }
    }, [data, top5NonCompliant]);

    const handleMouseLeave = useCallback(() => {
        setTooltipContent("");
    }, []);

    const mapContent = useMemo(() => (
        <ComposableMap
            projection="geoMercator"
            projectionConfig={{
                scale: 1100,
                center: [84, 23] // Adjusted to move map DOWN slightly to fix J&K cutting
            }}
            className="w-full h-full"
        >
            <Geographies geography={INDIA_GEO_JSON}>
                {({ geographies }) =>
                    geographies.map((geo) => {
                        const stateName = geo.properties.NAME_1;
                        const stateData = data.find(s => s.state === stateName || stateName.includes(s.state) || s.state.includes(stateName));

                        // Color logic: Color ALL states based on compliance
                        const fillColor = stateData ? colorScale(stateData.compliance) : '#f3f4f6';
                        const strokeColor = "#ffffff";
                        const hoverColor = '#263238';

                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={0.8}
                                style={{
                                    default: { outline: 'none', transition: 'fill 0.3s ease' },
                                    hover: { fill: hoverColor, outline: 'none', cursor: 'pointer' },
                                    pressed: { outline: 'none' }
                                }}
                                onMouseEnter={() => handleMouseEnter(geo)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => {
                                    if (stateData) {
                                        handleStateClick(stateData);
                                    }
                                }}
                                data-tooltip-id="heatmap-tooltip"
                                data-tooltip-html={tooltipContent}
                            />
                        );
                    })
                }
            </Geographies>
        </ComposableMap>
    ), [data, tooltipContent, handleMouseEnter, handleMouseLeave]);

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm p-6 shadow-sm h-full flex flex-col relative overflow-hidden font-sans">
            <div className="flex justify-between items-start mb-4 z-10 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        National Compliance Overview
                    </h2>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                        Live Monitoring • All Zones Active
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full h-full relative flex items-center justify-center bg-gray-50/30 dark:bg-gray-900/10 rounded-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Fetching Critical Data...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full h-full relative"
                    >
                        {mapContent}

                        {/* Top 5 Sidebar Overlay */}
                        <div className="absolute top-2 right-2 tablet8:top-4 tablet8:right-4 w-40 tablet8:w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-sm p-1.5 tablet8:p-4 z-20 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-1.5 tablet8:mb-3 border-b border-gray-200 dark:border-gray-700 pb-1.5 tablet8:pb-2">
                                <AlertTriangle className="w-3 h-3 tablet8:w-4 tablet8:h-4 text-red-600" />
                                <h3 className="text-[9px] tablet8:text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Top 5 Critical Zones</h3>
                            </div>
                            <div className="space-y-1 tablet8:space-y-3">
                                {top5NonCompliant.map((state, index) => (
                                    <div
                                        key={state.id}
                                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-0.5 tablet8:p-1 rounded transition-colors"
                                        onClick={() => state && handleStateClick(state)}
                                    >
                                        <div className="flex items-center gap-1.5 tablet8:gap-2">
                                            <span className="text-[9px] font-mono text-gray-400 w-3 tablet8:w-4">0{index + 1}</span>
                                            <span className="text-[9px] tablet8:text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[65px] tablet8:max-w-none">{state.state}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] tablet8:text-[10px] font-bold px-1 py-0.5 tablet8:px-1.5 tablet8:py-0.5 rounded-sm ${state.compliance < 50 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                state.compliance < 70 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                {state.compliance}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <ReactTooltip
                            id="heatmap-tooltip"
                            place="top"
                            style={{ backgroundColor: 'transparent', padding: 0, zIndex: 50, opacity: 1 }}
                            border="none"
                            opacity={1}
                        />
                    </motion.div>
                )}
            </div>

            {/* Legend - Full Scale */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#1b5e20]"></span>
                    <span>Compliant (&gt;90%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#fbc02d]"></span>
                    <span>Moderate (70-89%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#fb8c00]"></span>
                    <span>High Risk (50-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#c62828]"></span>
                    <span>Critical (&lt;50%)</span>
                </div>
            </div>

            {/* Detailed Compliance Modal */}
            {selectedState && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-900 text-white rounded-none shadow-2xl w-full max-w-md tablet8:max-w-lg overflow-hidden border border-gray-700 max-h-[90vh] flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-4 tablet8:p-5 border-b border-gray-800 relative shrink-0">
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] uppercase tracking-wider font-bold rounded-sm">Confidential</span>
                                <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-[10px] uppercase tracking-wider font-bold rounded-sm">State Report</span>
                            </div>
                            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-1">{selectedState.state}</h3>
                            <p className="text-xs text-gray-400 font-mono tracking-wide">ID: {selectedState.id} • REGION: INDIA</p>

                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 tablet8:p-6 space-y-4 tablet8:space-y-6 overflow-y-auto custom-scrollbar">
                            {/* Compliance Index Section */}
                            <div className="p-3 tablet8:p-4 bg-gray-800/50 border border-gray-700 rounded-sm">
                                <h4 className="text-[10px] tablet8:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 tablet8:mb-4 border-b border-gray-700 pb-2">Compliance Index</h4>
                                <div className="flex items-center gap-4 tablet8:gap-6">
                                    {/* Circular Progress (Simple SVG) */}
                                    <div className="relative w-16 h-16 tablet8:w-20 tablet8:h-20 flex items-center justify-center shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="36"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-gray-800"
                                            />
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="36"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={226}
                                                strokeDashoffset={226 - (226 * selectedState.compliance) / 100}
                                                className={`${selectedState.compliance >= 90 ? 'text-green-500' :
                                                    selectedState.compliance >= 70 ? 'text-amber-500' :
                                                        selectedState.compliance >= 50 ? 'text-orange-500' : 'text-red-600'
                                                    }`}
                                            />
                                        </svg>
                                        <span className="absolute text-xl font-bold">{selectedState.compliance}%</span>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm text-gray-400 mb-1">Status Assessment</p>
                                        <div className={`inline-block px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wide ${selectedState.compliance >= 90 ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                            selectedState.compliance >= 70 ? 'bg-amber-900/30 text-amber-400 border border-amber-800' :
                                                selectedState.compliance >= 50 ? 'bg-orange-900/30 text-orange-400 border border-orange-800' :
                                                    'bg-red-900/30 text-red-400 border border-red-800'
                                            }`}>
                                            {selectedState.compliance < 50 ? 'Critical Non-Compliance' :
                                                selectedState.compliance < 70 ? 'High Risk Zone' :
                                                    selectedState.compliance < 90 ? 'Moderate Compliance' : 'Fully Compliant'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3 tablet8:gap-4">
                                <div className="p-3 tablet8:p-4 bg-gray-800/30 border border-gray-700 rounded-sm">
                                    <p className="text-[9px] tablet8:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Violations</p>
                                    <p className="text-xl tablet8:text-2xl font-bold text-white">{selectedState.violations}</p>
                                </div>
                                <div className="p-3 tablet8:p-4 bg-gray-800/30 border border-gray-700 rounded-sm">
                                    <p className="text-[9px] tablet8:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Flagged Sellers</p>
                                    <p className="text-xl tablet8:text-2xl font-bold text-white">{selectedState.flaggedSellers}</p>
                                </div>
                            </div>

                            {/* Violation Types Table */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 border-l-2 border-white pl-2">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Primary Violation Types</h4>
                                </div>
                                <div className="bg-gray-800/30 border border-gray-700 rounded-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-800/50 border-b border-gray-700">
                                                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Violation Type</th>
                                                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/50">
                                            {selectedState.violationBreakdown && selectedState.violationBreakdown.map((v, i) => (
                                                <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-4 py-2 text-xs font-medium text-gray-300">{v.type}</td>
                                                    <td className="px-4 py-2 text-xs font-bold text-white text-right font-mono">{v.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ComplianceHeatmap;
