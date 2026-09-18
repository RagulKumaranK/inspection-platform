import React from 'react';
import ViolationCard from './ViolationCard';

const ViolationFeed = ({ violations }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Live Violation Feed
            </h2>

            <div className="space-y-3 min-h-[200px]">
                {violations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-xs font-medium">Waiting for detection...</p>
                    </div>
                ) : (
                    violations.map((violation, index) => (
                        <div
                            key={violation.id || index}
                        >
                            <ViolationCard violation={violation} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ViolationFeed;
