import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const ProgressSummary = ({ progress, currentStage, milestones }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Progress
                    </span>
                    <span className="text-2xl font-mono font-bold text-primary-600 dark:text-primary-400">
                        {progress}%
                    </span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Subtle gloss effect */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {milestones.map((milestone, index) => {
                    const isCompleted = milestone.status === 'completed';
                    const isCurrent = milestone.status === 'current';
                    const isPending = milestone.status === 'pending';

                    return (
                        <div key={index} className={`flex flex-col items-center text-center gap-2 transition-all duration-300 ${isPending ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                ${isCompleted ? 'bg-green-50 border-green-500 text-green-600' :
                                    isCurrent ? 'bg-primary-50 border-primary-500 text-primary-600' :
                                        'bg-gray-50 border-gray-300 text-gray-400'}
                            `}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                    isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                        <Circle className="w-5 h-5" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${isCurrent ? 'text-primary-700 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {milestone.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Dynamic Status Message */}
            <div className="text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                    {progress < 100 ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                            <span className="animate-pulse">{currentStage || "Initializing..."}</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Report Generation Complete</span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default ProgressSummary;
