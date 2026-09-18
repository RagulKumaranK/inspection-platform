import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const ReportHeader = ({ status = 'online' }) => {
    const getStatusBadge = () => {
        switch (status) {
            case 'online':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Online</span>
                    </div>
                );
            case 'syncing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
                        <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Syncing...</span>
                    </div>
                );
            case 'offline':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Offline</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 tablet8:px-6 tablet8:py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div>
                <h1 className="text-lg tablet8:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Compliance Report Generation
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    Detecting and compiling violations
                </p>
            </div>
            <div>
                {getStatusBadge()}
            </div>
        </header>
    );
};

export default ReportHeader;
