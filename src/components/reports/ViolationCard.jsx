import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const ViolationCard = ({ violation }) => {
    const [expanded, setExpanded] = useState(false);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-50 border-red-200 text-red-700';
            case 'medium': return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'low': return 'bg-blue-50 border-blue-200 text-blue-700';
            default: return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case 'critical': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">Critical</span>;
            case 'medium': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">Medium</span>;
            case 'low': return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">Low</span>;
            default: return null;
        }
    };

    return (
        <div className={`border rounded-lg transition-all duration-300 ${expanded ? 'shadow-md' : 'shadow-sm hover:shadow'} ${getSeverityColor(violation.severity)} bg-opacity-20 dark:bg-opacity-10`}>
            {/* Card Header */}
            <div
                className="p-4 flex items-start gap-3 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="mt-0.5">
                    <AlertTriangle className={`w-5 h-5 ${violation.severity === 'critical' ? 'text-red-600' : violation.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {violation.type}
                        </h3>
                        {getSeverityBadge(violation.severity)}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                        <span>Platform: {violation.platform}</span>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="font-mono">ID: {violation.id}</span>
                    </div>
                </div>
                <div className="text-gray-400">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            {/* Processing State / Download Action */}
            {violation.status === 'processing' && (
                <div className="px-4 pb-4">
                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 animate-pulse">Generating Report...</span>
                            <span className="text-[10px] font-mono text-gray-500">Processing</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite] w-1/3"></div>
                        </div>
                    </div>
                </div>
            )}

            {violation.status === 'completed' && (
                <div className="px-4 pb-4 flex justify-end">
                    <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold py-2 px-4 rounded-md shadow-sm transition-all active:scale-95">
                        <ExternalLink className="w-3 h-3" /> Download Report
                    </button>
                </div>
            )}

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-200/50 dark:border-gray-700/50 mt-2">
                    <div className="pt-3">
                        {/* Details */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Extracted Text</h4>
                                <div className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-700 dark:text-gray-300">
                                    {violation.extractedText || "No text extracted"}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Rule Reference</h4>
                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                    {violation.ruleReference || "Legal Metrology Act, 2009 - Section 18(1)"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViolationCard;
