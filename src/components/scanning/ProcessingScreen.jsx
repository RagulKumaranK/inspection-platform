import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock } from 'lucide-react';

const ProcessingScreen = ({ imagesCount = 1, images = [], onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Advances 0% -> 100% over ~38 seconds
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 400);
                    return 100;
                }
                return prev + 1;
            });
        }, 380);

        return () => clearInterval(interval);
    }, [onComplete]);

    const remainingSeconds = Math.max(0, Math.ceil(((100 - progress) * 380) / 1000));

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative max-w-sm w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 text-center space-y-5 font-sans">
                
                {/* Selected Images Preview Row */}
                {images.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Selected Images ({images.length})
                        </p>
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                            {images.slice(0, 4).map((img, idx) => (
                                <div key={idx} className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                                    <img src={img.dataUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Animated Spinner & Status Message */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Processing Product Images
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Extracting declarations and verifying compliance...
                    </p>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-2 pt-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-700 dark:bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span>{progress}% Completed</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> ~{remainingSeconds}s remaining
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessingScreen;
