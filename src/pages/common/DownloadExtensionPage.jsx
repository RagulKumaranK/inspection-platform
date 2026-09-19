import React, { useState } from 'react';
import {
    Download,
    CheckCircle2,
    ShieldCheck,
    FolderArchive,
    ToggleRight,
    FolderInput,
    Copy,
    Check,
    Monitor,
    Search,
    FileText,
    Zap,
    Info,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

const DownloadExtensionPage = () => {
    const [copiedPath, setCopiedPath] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const extensionZipPath = '/legal-metrology-extension.zip';
    const chromeUrl = 'chrome://extensions';

    const handleDownload = () => {
        setDownloading(true);
        const link = document.createElement('a');
        link.href = extensionZipPath;
        link.setAttribute('download', 'legal-metrology-extension.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setDownloading(false);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 4000);
        }, 600);
    };

    const handleCopyChromeUrl = () => {
        navigator.clipboard.writeText(chromeUrl);
        setCopiedPath(true);
        setTimeout(() => setCopiedPath(false), 2500);
    };

    const steps = [
        {
            title: 'Download Extension Package',
            description: 'Download the legal-metrology-extension.zip package (2.6 MB) to your local machine.',
            content: (
                <div className="mt-2.5">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-xs transition-all active:scale-95 disabled:opacity-75"
                    >
                        <Download className="w-4 h-4" />
                        <span>{downloading ? 'Downloading...' : 'Download legal-metrology-extension.zip'}</span>
                    </button>
                </div>
            )
        },
        {
            title: 'Extract the Archive',
            description: 'Locate the downloaded ZIP file in your Downloads folder, right-click, and choose "Extract All..." to uncompress into a local folder.'
        },
        {
            title: 'Open Chrome Extensions',
            description: 'Open Google Chrome or any Chromium browser (Edge, Brave, Opera) and navigate to chrome://extensions in the address bar.',
            content: (
                <div className="mt-2.5">
                    <button
                        onClick={handleCopyChromeUrl}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                        {copiedPath ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied chrome://extensions</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy chrome://extensions</span>
                            </>
                        )}
                    </button>
                </div>
            )
        },
        {
            title: 'Enable Developer Mode',
            description: 'Toggle ON the "Developer mode" switch located at the top-right corner of the Extensions page.'
        },
        {
            title: 'Load Unpacked Extension',
            description: 'Click the "Load unpacked" button in the top toolbar and select the extracted extension folder.'
        }
    ];

    const specifications = [
        { label: 'System Name', value: 'Product Compliance Inspection Platform' },
        { label: 'Extension Title', value: 'Product Declaration Inspection Extension (v1.0.0)' },
        { label: 'Manifest Version', value: 'Chrome Manifest V3' },
        { label: 'Compliance Scope', value: 'Legal Metrology (Packaged Commodities) Rules, 2011 & 2026 Amendments' },
        { label: 'OCR Engine', value: 'Tesseract WebAssembly Client-Side Engine' },
        { label: 'Supported Platforms', value: 'Amazon India, Flipkart, Blinkit, Swiggy Instamart, BigBasket, JioMart' }
    ];

    return (
        <main className="max-w-7xl mx-auto px-4 py-6 tablet8:px-6 tablet8:py-8 space-y-6 text-gray-900 dark:text-gray-100">

            {/* Product Theme Header Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 tablet8:p-6 shadow-sm transition-colors duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-5">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-xl tablet8:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                Product Declaration Inspection Extension
                            </h1>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full">
                                v1.0.0
                            </span>
                            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Inspection Tool
                            </span>
                        </div>
                        <p className="text-xs tablet8:text-sm text-gray-600 dark:text-gray-300">
                            Real-time e-commerce product listing inspector for compliance officers.
                        </p>
                    </div>

                    {/* Main CTA Button */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className={`
                                inline-flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all
                                ${downloadSuccess
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white'
                                }
                                disabled:opacity-75 disabled:cursor-not-allowed
                            `}
                        >
                            <Download className="w-4 h-4" />
                            <span>{downloading ? 'Preparing Download...' : downloadSuccess ? 'Downloaded!' : 'Download Extension ZIP'}</span>
                        </button>
                    </div>
                </div>

                {/* Theme Info Alert Banner */}
                <div className="mt-5 p-4 rounded-xl bg-primary-50/80 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/80 text-xs tablet8:text-sm text-primary-900 dark:text-primary-200 flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <span className="font-bold block">Client-Side Enforcement Scanner</span>
                        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                            This web extension integrates directly into Chromium browsers to inspect product page packaging declarations (MRP, Net Quantity, Country of Origin, Date of Packing/Mfg, Unit Price) and flag Legal Metrology Rule 6 & Rule 9 violations instantly.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Installation Stepper */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 tablet8:p-6 shadow-sm">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Installation Instructions
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Follow these steps to install the extension in your browser.
                            </p>
                        </div>

                        {/* Product-Themed Stepper Timeline */}
                        <div className="relative pl-8 space-y-7 before:absolute before:left-3.5 before:top-3.5 before:bottom-3.5 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                            {steps.map((step, idx) => (
                                <div key={idx} className="relative flex items-start gap-4">
                                    {/* Number Circle */}
                                    <div className="absolute -left-8 top-0 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-xs">
                                        {idx + 1}
                                    </div>

                                    <div className="space-y-1 flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {step.description}
                                        </p>
                                        {step.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-gray-100">
                                <Search className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span>Automated Listing Inspection</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Extracts seller declarations, price structures, and images from active e-commerce product tabs.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-gray-100">
                                <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span>Packaging OCR Parsing</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Executes Tesseract WebAssembly to verify font height and mandatory label text clarity.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Technical Specifications */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Specifications Card */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                Technical Specifications
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                            {specifications.map((spec, i) => (
                                <div key={i} className="grid grid-cols-12">
                                    <div className="col-span-5 p-3.5 bg-gray-50/60 dark:bg-gray-800/50 font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                                        {spec.label}
                                    </div>
                                    <div className="col-span-7 p-3.5 text-gray-900 dark:text-gray-200 font-medium">
                                        {spec.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Supported Platforms Card */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Supported E-Commerce Marketplaces
                        </h3>

                        <div className="flex flex-wrap gap-2 text-xs">
                            {['Amazon India', 'Flipkart', 'Blinkit', 'Swiggy Instamart', 'BigBasket', 'JioMart'].map((name) => (
                                <span
                                    key={name}
                                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-600"
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-4 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Enterprise Security Compliance</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs">
                            Operates entirely within the browser context. No packaging scans or credentials are sent to external third-party servers.
                        </p>
                    </div>

                </div>
            </div>

        </main>
    );
};

export default DownloadExtensionPage;
