import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, Wifi, WifiOff } from 'lucide-react';

const MetadataRecorder = ({ user, isOnline }) => {
    const [location, setLocation] = useState(null);
    const [timestamp, setTimestamp] = useState(new Date());

    useEffect(() => {
        // Mock GPS Location
        const mockLocation = {
            lat: 12.9716,
            lon: 77.5946,
            accuracy: 15
        };

        // Simulate fetching location
        setTimeout(() => {
            setLocation(mockLocation);
        }, 1000);

        // Update timestamp every minute
        const timer = setInterval(() => {
            setTimestamp(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-2 tablet8:p-3 border border-slate-200 dark:border-slate-700 text-[10px] tablet8:text-xs text-slate-500 dark:text-slate-400 shadow-sm font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[80px] tablet8:max-w-none">
                            {user?.name || 'Officer'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-3">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <MapPin className={`w-3 h-3 ${location ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px] tablet8:max-w-none">
                            {location ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : 'Locating...'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-3">
                        {isOnline ? (
                            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <Wifi className="w-3 h-3" />
                                <span className="uppercase tracking-wider hidden tablet8:inline">Online</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-slate-500 font-semibold">
                                <WifiOff className="w-3 h-3" />
                                <span className="uppercase tracking-wider hidden tablet8:inline">Offline</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetadataRecorder;
