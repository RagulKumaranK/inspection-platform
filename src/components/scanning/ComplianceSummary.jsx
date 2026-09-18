import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const ComplianceSummary = ({ result }) => {
    const isCompliant = result.status === 'Compliant';
    const confidencePercent = Math.round(result.confidence * 100);

    return (
        <div
            className={`rounded-lg border p-4 sm:p-5 shadow-sm font-sans ${
                isCompliant
                    ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
                    : 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800'
            }`}
        >
            <div className="flex items-start gap-3.5">
                <div
                    className={`p-2.5 rounded-full shrink-0 ${
                        isCompliant
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
                    }`}
                >
                    {isCompliant ? (
                        <CheckCircle2 className="w-6 h-6" />
                    ) : (
                        <AlertTriangle className="w-6 h-6" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Audit Result
                            </span>
                            <h3
                                className={`text-base font-bold ${
                                    isCompliant
                                        ? 'text-emerald-800 dark:text-emerald-200'
                                        : 'text-rose-800 dark:text-rose-200'
                                }`}
                            >
                                {isCompliant ? 'Compliant' : 'Non-Compliant'}
                            </h3>
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                            {confidencePercent}% Confidence
                        </span>
                    </div>

                    {!isCompliant && result.issues && result.issues.length > 0 && (
                        <div className="bg-white/80 dark:bg-slate-900/60 rounded p-3 border border-rose-200/60 dark:border-rose-800/60 space-y-1.5">
                            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> Detected Non-Compliance Issues
                            </h4>
                            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                {result.issues.map((issue, index) => (
                                    <li key={index} className="flex items-start gap-1.5">
                                        <span className="text-rose-600 font-bold">•</span>
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplianceSummary;
