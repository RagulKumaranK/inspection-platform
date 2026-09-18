import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';

// Platform-specific categories
const platformCategories = {
    Amazon: [
        { id: 'grocery', name: 'Grocery', icon: 'shopping-cart' },
        { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
        { id: 'home', name: 'Home & Kitchen', icon: 'home' },
        { id: 'electronics', name: 'Electronics', icon: 'device-mobile' },
        { id: 'fashion', name: 'Fashion', icon: 'shirt' },
    ],
    Flipkart: [
        { id: 'grocery', name: 'Grocery', icon: 'shopping-cart' },
        { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
        { id: 'home', name: 'Home', icon: 'home' },
        { id: 'electronics', name: 'Electronics', icon: 'device-mobile' },
        { id: 'fashion', name: 'Fashion', icon: 'shirt' },
    ],
    JioMart: [
        { id: 'grocery', name: 'Grocery', icon: 'shopping-cart' },
        { id: 'beauty', name: 'Beauty', icon: 'sparkles' },
        { id: 'home', name: 'Home', icon: 'home' },
        { id: 'dairy', name: 'Dairy', icon: 'beaker' },
        { id: 'personal_care', name: 'Personal Care', icon: 'heart' },
    ],
    Myntra: [
        { id: 'gourmet', name: 'Gourmet', icon: 'cake' },
        { id: 'skincare', name: 'Skincare', icon: 'sparkles' },
        { id: 'makeup', name: 'Makeup', icon: 'eye' },
        { id: 'haircare', name: 'Haircare', icon: 'scissors' },
        { id: 'fragrance', name: 'Fragrance', icon: 'cloud' },
    ]
};

// Icons helper
const getIcon = (name) => {
    switch (name) {
        case 'device-mobile': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
        case 'shirt': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
        case 'home': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
        case 'sparkles': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
        case 'shopping-cart': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
        case 'link': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
        case 'beaker': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
        case 'heart': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
        case 'cake': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>;
        case 'eye': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
        case 'scissors': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" /></svg>;
        case 'cloud': return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
        default: return null;
    }
};

const ModeCard = ({ id, title, subtitle, iconPath, mode, setMode, setStatus }) => (
    <button
        onClick={() => { setMode(id); setStatus('idle'); }}
        className={`
            flex items-center p-4
            bg-white dark:bg-gray-800 
            border rounded-xl text-left 
            transition-all duration-200 
            group
            ${mode === id
                ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm'
                : 'border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600'
            }
        `}
    >
        <div className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors
            ${mode === id
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40'
            }
        `}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {iconPath}
            </svg>
        </div>
        <div>
            <h3 className={`text-sm font-bold ${mode === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                {title}
            </h3>
            {subtitle && (
                <p className={`text-xs mt-0.5 ${mode === id ? 'text-blue-400 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    </button>
);

const CategoryGrid = ({ categories = [], selected, onSelect, onUrlClick }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {categories.map((cat) => (
            <button
                key={cat.id}
                onClick={() => onSelect(cat)}
                className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
                    ${selected?.id === cat.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }
                `}
            >
                <div className={`mb-2 ${selected?.id === cat.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {getIcon(cat.icon)}
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
            </button>
        ))}
        <button
            onClick={onUrlClick}
            className={`
                flex flex-col items-center justify-center p-4 rounded-xl border border-dashed transition-all duration-200
                ${selected?.type === 'url'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-white dark:hover:bg-gray-700 text-gray-500'
                }
            `}
        >
            <div className="mb-2">
                {getIcon('link')}
            </div>
            <span className="text-sm font-medium">Enter URL</span>
        </button>
    </div>
);

const ScanningConfiguration = () => {
    const [mode, setMode] = useState('live'); // live, category, bulk, instant
    const [status, setStatus] = useState('idle'); // idle, running, completed
    const [progress, setProgress] = useState(0);

    // Form States
    const [categoryPlatform, setCategoryPlatform] = useState('Amazon');
    const [selectedCategory, setSelectedCategory] = useState(null); // { name, icon } or { type: 'url', value: '...' }
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [scanDuration, setScanDuration] = useState('10'); // minutes

    const [bulkPlatform, setBulkPlatform] = useState('Amazon');
    const [bulkCategory, setBulkCategory] = useState(null);

    const [bulkCount, setBulkCount] = useState(100);

    // New Count States
    const [liveCount, setLiveCount] = useState(50);
    const [categoryCount, setCategoryCount] = useState(50);

    // Instant Scan States
    const [instantUrl, setInstantUrl] = useState('');
    const [instantResult, setInstantResult] = useState(null); // null, 'compliant', 'non-compliant'

    // Derived State
    const bulkTimeEstimate = (bulkCount * 0.8 / 60).toFixed(1); // 0.8s per item, in minutes

    // Reset selection when platform changes
    useEffect(() => {
        setSelectedCategory(null);
    }, [categoryPlatform]);

    useEffect(() => {
        setBulkCategory(null);
    }, [bulkPlatform]);

    useEffect(() => {
        let interval;
        if (status === 'running') {
            // For Instant Scan, we rely on the API response to complete
            if (mode !== 'instant') {
                interval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 100) {
                            setStatus('completed');
                            return 100;
                        }
                        return prev + 0.5; // Smooth progress
                    });
                }, 50);
            }
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [status, mode]);

    const handleStart = async () => {
        setStatus('running');
        setInstantResult(null);

        try {
            if (mode === 'live') {
                await dashboardService.startLiveMonitoring(liveCount);
            } else if (mode === 'category') {
                if (!selectedCategory) return;
                await dashboardService.startCategoryScan(
                    categoryPlatform,
                    selectedCategory.id || selectedCategory.value,
                    scanDuration,
                    categoryCount
                );

            } else if (mode === 'bulk') {
                if (!bulkCategory) return;
                await dashboardService.startBulkScan(
                    bulkPlatform,
                    bulkCategory.id || bulkCategory.value,
                    bulkCount
                );

            } else if (mode === 'instant') {
                if (!instantUrl) return;

                try {
                    const response = await dashboardService.instantScan(instantUrl);

                    // Map backend response to UI state
                    if (response.status === 'compliant') {
                        setInstantResult('compliant');
                    } else {
                        setInstantResult('non-compliant');
                    }
                    setStatus('completed');
                    setProgress(100);
                } catch (error) {
                    console.error("Instant scan failed:", error);
                    // Fallback for demo if API fails
                    setInstantResult('non-compliant');
                    setStatus('completed');
                }
            }

        } catch (error) {
            console.error(`Failed to start ${mode} scan:`, error);
            setStatus('idle');
        }
    };

    const handleStop = async () => {
        if (mode === 'live') {
            try {
                // TODO: Connect to Backend
                // API: POST /scanning/live/stop
                await dashboardService.stopLiveMonitoring();
            } catch (error) {
                console.error("Failed to stop live monitoring:", error);
            }
        }

        setStatus('idle');
        setProgress(0);
        setInstantResult(null);
    };

    const handleUrlSubmit = () => {
        if (urlInput) {
            const categoryData = { type: 'url', name: 'Custom URL', value: urlInput, icon: 'link' };
            if (mode === 'category') setSelectedCategory(categoryData);
            else setBulkCategory(categoryData);
            setShowUrlModal(false);
            setUrlInput('');
        }
    };

    const handleInstantReset = () => {
        setStatus('idle');
        setInstantResult(null);
        setInstantUrl('');
        setProgress(0);
    };

    return (
        <div className="mt-8">
            <div className="mb-4 px-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Scanning Configuration
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <ModeCard
                    id="live"
                    title="Live Marketplace Scan"
                    subtitle="Monitor and capture real-time product listings from selected platforms."
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    mode={mode}
                    setMode={setMode}
                    setStatus={setStatus}
                />
                <ModeCard
                    id="category"
                    title="Category Live Monitoring"
                    subtitle="Track compliance for products within a selected category in real time."
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
                    mode={mode}
                    setMode={setMode}
                    setStatus={setStatus}
                />
                <ModeCard
                    id="bulk"
                    title="Bulk Historical Scan"
                    subtitle="Scan and analyze existing or previously listed product data in batches."
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                    mode={mode}
                    setMode={setMode}
                    setStatus={setStatus}
                />
                <ModeCard
                    id="instant"
                    title="Single Product Check"
                    subtitle="Paste a product URL and run instant compliance analysis."
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                    mode={mode}
                    setMode={setMode}
                    setStatus={setStatus}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                            {mode === 'live' && 'Configuration'}
                            {mode === 'category' && 'Select Category'}
                            {mode === 'bulk' && 'Configuration'}
                            {mode === 'instant' && 'Instant Product Check'}
                        </h4>
                        {mode === 'category' && (
                            <span className="text-xs text-gray-500">Select a category to start scanning</span>
                        )}
                    </div>

                    {mode === 'live' && (
                        <div className="flex flex-col items-center text-center animate-fade-in py-4">
                            {status === 'idle' ? (
                                <>
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Initialize Live Monitoring</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                                        Activate the neural scanning network to monitor all connected marketplaces in real-time.


                                    </p>

                                    <div className="w-full max-w-xs mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Products to Scan
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={liveCount}
                                                onChange={(e) => setLiveCount(parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-center"
                                                min="1"
                                            />
                                            <div className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">items</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStart}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Start System
                                    </button>
                                </>
                            ) : (
                                <div className="w-full max-w-2xl">
                                    <div className="relative w-64 h-64 mb-6 flex items-center justify-center mx-auto">
                                        {/* Static Rings */}
                                        <div className="absolute inset-0 border border-blue-100 dark:border-blue-900/30 rounded-full"></div>
                                        <div className="absolute inset-[15%] border border-blue-100 dark:border-blue-900/30 rounded-full"></div>
                                        <div className="absolute inset-[30%] border border-blue-100 dark:border-blue-900/30 rounded-full"></div>

                                        {/* Pulse Effect */}
                                        <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-pulse-ring"></div>

                                        {/* Radar Sweep */}
                                        <div className="absolute inset-0 rounded-full animate-radar bg-[conic-gradient(transparent_270deg,rgba(37,99,235,0.1)_360deg)] dark:bg-[conic-gradient(transparent_270deg,rgba(59,130,246,0.2)_360deg)]"></div>

                                        {/* Center Core */}
                                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10"></div>

                                        {/* Simulated Blips */}
                                        <div className="absolute top-12 right-16 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                        <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse opacity-60 delay-1000"></div>
                                        <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-40 delay-500"></div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Live Monitoring Active</h3>
                                    <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Scanning nodes: 4/4 connected
                                    </div>
                                    <button onClick={handleStop} className="text-red-600 hover:text-red-700 text-sm font-medium">Stop Monitoring</button>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'category' && (
                        <div className="animate-fade-in">
                            {status === 'idle' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Platform</label>
                                                <select
                                                    value={categoryPlatform}
                                                    onChange={(e) => setCategoryPlatform(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                >
                                                    <option>Amazon</option>
                                                    <option>Flipkart</option>
                                                    <option>JioMart</option>
                                                    <option>Myntra</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Scan Duration</label>
                                                <select
                                                    value={scanDuration}
                                                    onChange={(e) => setScanDuration(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                >
                                                    <option value="10">10 Minutes</option>
                                                    <option value="30">30 Minutes</option>
                                                    <option value="60">1 Hour</option>
                                                    <option value="120">2 Hours</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Count</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={categoryCount}
                                                        onChange={(e) => setCategoryCount(parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                        min="1"
                                                    />
                                                    <div className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">items</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <CategoryGrid
                                            categories={platformCategories[categoryPlatform]}
                                            selected={selectedCategory}
                                            onSelect={setSelectedCategory}
                                            onUrlClick={() => setShowUrlModal(true)}
                                        />
                                        <div className="flex justify-end mt-6">
                                            <button
                                                onClick={handleStart}
                                                disabled={!selectedCategory}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium rounded-lg shadow-sm transition-colors"
                                            >
                                                Start Scan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-full max-w-lg mb-6">
                                        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                                            <span>Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Scanning {selectedCategory?.name || 'Category'}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Analyzing products on {categoryPlatform}...</p>
                                    <button onClick={handleStop} className="text-gray-400 hover:text-gray-600 text-sm">Cancel Operation</button>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'bulk' && (
                        <div className="animate-fade-in">
                            {status === 'idle' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Platform</label>
                                                <select
                                                    value={bulkPlatform}
                                                    onChange={(e) => setBulkPlatform(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                >
                                                    <option>Amazon</option>
                                                    <option>Flipkart</option>
                                                    <option>JioMart</option>
                                                    <option>Myntra</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Count</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={bulkCount}
                                                        onChange={(e) => setBulkCount(parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                                    />
                                                    <div className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">items</div>
                                                </div>
                                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Est. Time: {bulkTimeEstimate} minutes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <CategoryGrid
                                            categories={platformCategories[bulkPlatform]}
                                            selected={bulkCategory}
                                            onSelect={setBulkCategory}
                                            onUrlClick={() => setShowUrlModal(true)}
                                        />
                                        <div className="flex justify-end mt-6">
                                            <button
                                                onClick={handleStart}
                                                disabled={!bulkCategory || bulkCount <= 0}
                                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium rounded-lg shadow-sm transition-colors"
                                            >
                                                Start Analysis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="relative w-24 h-24 mb-6">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-700" fill="none" />
                                            <circle
                                                cx="48" cy="48" r="44"
                                                stroke="currentColor" strokeWidth="6"
                                                className="text-blue-600 transition-all duration-300"
                                                fill="none"
                                                strokeDasharray={276}
                                                strokeDashoffset={276 - (276 * progress) / 100}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Processing Batch</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Analyzed {Math.floor((progress / 100) * bulkCount)} of {bulkCount} items</p>

                                    <button onClick={handleStop} className="text-gray-400 hover:text-gray-600 text-sm">Cancel Batch</button>
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'instant' && (
                        <div className="animate-fade-in">
                            {status === 'idle' && !instantResult ? (
                                <div className="flex flex-col items-center justify-center py-8 max-w-xl mx-auto">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">One Product Instant Scan</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
                                        Enter a product URL to instantly check for compliance violations.
                                    </p>

                                    <div className="w-full relative mb-6">
                                        <input
                                            type="text"
                                            value={instantUrl}
                                            onChange={(e) => setInstantUrl(e.target.value)}
                                            placeholder="Paste product URL here..."
                                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                                        />
                                        <div className="absolute right-3 top-3 text-gray-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStart}
                                        disabled={!instantUrl}
                                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Scan Now
                                    </button>
                                </div>
                            ) : status === 'running' ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-20 h-20 mb-8">
                                        <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-700 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Scanning Product...</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Checking against compliance database</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in py-6">
                                    {instantResult === 'compliant' ? (
                                        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                                                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Compliance Issues Found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-8">
                                                The product appears to be fully compliant with all regulatory standards.
                                            </p>
                                            <button
                                                onClick={handleInstantReset}
                                                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                                            >
                                                Scan Another Product
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="max-w-3xl mx-auto">
                                            <div className="flex items-start gap-6 mb-8">
                                                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wide">
                                                            Non-Compliant
                                                        </span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">Scanned just now</span>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                        Product Name Placeholder
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                        {instantUrl}
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                                                            View Full Report
                                                        </button>
                                                        <button
                                                            onClick={handleInstantReset}
                                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                                                        >
                                                            Scan Another
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-100 dark:border-red-900/20">
                                                <h4 className="text-sm font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    Detected Violations
                                                </h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-3 text-sm text-red-700 dark:text-red-400">
                                                        <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                                        <span><strong>Missing MRP Declaration:</strong> The product listing fails to clearly state the Maximum Retail Price as required by the Legal Metrology Act.</span>
                                                    </li>
                                                    <li className="flex items-start gap-3 text-sm text-red-700 dark:text-red-400">
                                                        <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                                        <span><strong>Incorrect Country of Origin:</strong> The country of origin field is ambiguous or missing.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* URL Modal */}
            {showUrlModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Enter Category URL</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Paste the direct link to the category page you want to scan.</p>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none mb-6 text-sm"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowUrlModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!urlInput}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Confirm URL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanningConfiguration;
