import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const StateDetailsDrawer = ({ isOpen, onClose, stateData }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && stateData) {
            fetchStateDetails(stateData.state);
        }
    }, [isOpen, stateData]);

    const fetchStateDetails = async (stateName) => {
        setLoading(true);
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 50));

        // Mock Response
        const mockDetails = {
            state: stateName,
            compliance: stateData.compliance,
            totalViolations: stateData.violations,
            highRiskSellers: Math.floor(stateData.violations * 0.15),
            topViolations: [
                { type: "Missing MRP Text", count: Math.floor(stateData.violations * 0.4) },
                { type: "No Country of Origin", count: Math.floor(stateData.violations * 0.3) },
                { type: "Incorrect Net Quantity", count: Math.floor(stateData.violations * 0.2) }
            ],
            updatedAt: new Date().toISOString(),
            trend: stateData.compliance > 80 ? 'positive' : stateData.compliance < 60 ? 'negative' : 'stable'
        };

        setDetails(mockDetails);
        setLoading(false);
    };

    const getTrendIcon = (trend) => {
        if (trend === 'positive') return <TrendingUp className="text-emerald-500" size={20} />;
        if (trend === 'negative') return <TrendingDown className="text-rose-500" size={20} />;
        return <Minus className="text-gray-400" size={20} />;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-200 dark:border-gray-700 font-sans"
                    >
                        <div className="p-0 min-h-full flex flex-col">
                            {/* Header - Case File Style */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-mono uppercase tracking-widest rounded-sm">
                                                CONFIDENTIAL
                                            </span>
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-mono uppercase tracking-widest rounded-sm">
                                                STATE REPORT
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight uppercase">
                                            {stateData?.state}
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                                            ID: {stateData?.id || 'N/A'} • REGION: INDIA
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-sm"
                                    >
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Retrieving Records...</p>
                                    </div>
                                ) : details ? (
                                    <div className="space-y-8">
                                        {/* Compliance Score Section */}
                                        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-sm">
                                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Compliance Index</span>
                                                {getTrendIcon(details.trend)}
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-gray-100 dark:border-gray-800">
                                                    <div
                                                        className="absolute inset-0 rounded-full border-4 border-transparent"
                                                        style={{
                                                            borderTopColor: details.compliance >= 90 ? '#1b5e20' : details.compliance >= 70 ? '#fbc02d' : details.compliance >= 50 ? '#fb8c00' : '#c62828',
                                                            transform: 'rotate(-45deg)'
                                                        }}
                                                    ></div>
                                                    <span className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
                                                        {details.compliance}%
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                        Status Assessment
                                                    </div>
                                                    <div className={`text-xs font-bold uppercase tracking-wide px-2 py-1 inline-block rounded-sm ${details.compliance >= 90 ? 'bg-green-100 text-green-800' :
                                                        details.compliance >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                                            details.compliance >= 50 ? 'bg-orange-100 text-orange-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {details.compliance >= 90 ? 'Fully Compliant' :
                                                            details.compliance >= 70 ? 'Moderate Risk' :
                                                                details.compliance >= 50 ? 'High Risk' : 'Critical Non-Compliance'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Key Metrics Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50/50 dark:bg-gray-800/50">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Violations</div>
                                                <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">{details.totalViolations}</div>
                                            </div>
                                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-sm bg-gray-50/50 dark:bg-gray-800/50">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Flagged Sellers</div>
                                                <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">{details.highRiskSellers}</div>
                                            </div>
                                        </div>

                                        {/* Top Violations Table */}
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-1 h-4 bg-gray-900 dark:bg-gray-100"></span>
                                                Primary Violation Types
                                            </h3>
                                            <div className="border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 font-medium">
                                                        <tr>
                                                            <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Violation Type</th>
                                                            <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-right">Count</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {details.topViolations.map((v, i) => (
                                                            <tr key={i} className="bg-white dark:bg-gray-900">
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{v.type}</td>
                                                                <td className="px-4 py-3 text-right font-mono font-bold text-gray-900 dark:text-gray-100">{v.count}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase font-mono">
                                    <span>System Generated Report</span>
                                    <span>{new Date(details?.updatedAt || Date.now()).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default StateDetailsDrawer;
