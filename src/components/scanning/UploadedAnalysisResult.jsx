import React, { useState } from 'react';
import { Package, AlertTriangle, RefreshCw, RotateCcw, Send, CheckSquare, CheckCircle2, ClipboardList, Ruler, Save, Trash2, Camera, FileText } from 'lucide-react';
import InspectionReportModal from './InspectionReportModal';

const UploadedAnalysisResult = ({ mode = 'upload', imagesCount = 2, capturedImages = [], extractedData, user, onRescanArUco, onSendForReview }) => {
    const [isReportOpen, setIsReportOpen] = useState(false);

    // -------------------------------------------------------------
    // UPLOAD MODE DATA (Sunfeast Dark Fantasy Choco Fills - INDETERMINATE)
    // -------------------------------------------------------------
    const uploadCheckTableData = [
        { check: 'Image Quality', result: 'PASS', type: 'success' },
        { check: 'Product Identification', result: 'DETECTED', type: 'success' },
        { check: 'Mandatory Declarations', result: 'EXTRACTED', type: 'success' },
        { check: 'MRP / Net Quantity', result: 'EXTRACTED', type: 'success' },
        { check: 'Manufacturer / Packer', result: 'EXTRACTED', type: 'success' },
        { check: 'Country of Origin', result: 'CHECK', type: 'warning' },
        { check: 'Font Size Measurement', result: 'NOT VERIFIABLE', type: 'amber-dot' },
        { check: 'Physical Scale', result: 'REFERENCE MISSING', type: 'amber-dot' },
        { check: 'Evidence Cross-Verification', result: 'PROCESSING / CHECK', type: 'blue-refresh' },
        { check: 'Overall Decision', result: 'INDETERMINATE', type: 'highlight-indeterminate' }
    ];

    const uploadImageAnalysisRows = [
        { img: 'Image 1', type: 'Front Label', note: 'Product Identified', status: 'emerald' },
        { img: 'Image 2', type: 'Creative Visual', note: 'Marketing Content', status: 'emerald' },
        { img: 'Image 3', type: 'Back Label', note: 'Declarations Found', status: 'emerald' },
        { img: 'Image 4', type: 'Back Label', note: 'Conflicting Data', status: 'amber' },
        { img: 'Image 5', type: 'Creative Visual', note: 'Marketing Content', status: 'emerald' }
    ];

    // -------------------------------------------------------------
    // CAMERA MODE DATA (Mayora Choki Choki Rollz - COMPLIANT)
    // -------------------------------------------------------------
    const cameraCheckTableData = [
        { check: 'Image Quality', result: 'PASS', status: 'emerald' },
        { check: 'Product Identification', result: 'DETECTED', status: 'emerald' },
        { check: 'Mandatory Declarations', result: 'EXTRACTED', status: 'emerald' },
        { check: 'MRP / Net Quantity', result: 'EXTRACTED', status: 'emerald' },
        { check: 'Manufacturer / Marketer', result: 'EXTRACTED', status: 'emerald' },
        { check: 'Country of Origin', result: 'DETECTED', status: 'emerald' },
        { check: 'Barcode', result: 'DETECTED', status: 'emerald' },
        { check: 'Physical Scale', result: 'ARUCO DETECTED', status: 'emerald' },
        { check: 'Font Size Measurement', result: 'MEASURABLE', status: 'emerald' },
        { check: 'Evidence Cross-Verification', result: 'CHECKING', status: 'blue' }
    ];

    const cameraImageAnalysisRows = [
        { img: 'Image 1', type: 'Front Label', note: 'Product Identified', status: 'emerald' },
        { img: 'Image 2', type: 'Back Label', note: 'Declarations Found', status: 'emerald' }
    ];

    const cameraDeclarationMeasurements = [
        { declaration: 'Net Quantity', size: '2.14 mm', status: 'PASS' },
        { declaration: 'MRP', size: '2.08 mm', status: 'PASS' },
        { declaration: 'Unit Sale Price', size: '1.76 mm', status: 'PASS' },
        { declaration: 'Manufacturer', size: '1.83 mm', status: 'PASS' },
        { declaration: 'Marketed By', size: '1.81 mm', status: 'PASS' },
        { declaration: 'Consumer Care', size: '1.79 mm', status: 'PASS' },
        { declaration: 'Lot No.', size: '1.72 mm', status: 'PASS' },
        { declaration: 'MFD / Use By', size: '1.86 mm', status: 'PASS' }
    ];

    const renderResultCell = (row) => {
        switch (row.type) {
            case 'success':
                return (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>{row.result}</span>
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>{row.result}</span>
                    </span>
                );
            case 'amber-dot':
                return (
                    <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 inline-block" />
                        <span>{row.result}</span>
                    </span>
                );
            case 'blue-refresh':
                return (
                    <span className="inline-flex items-center gap-1.5 text-blue-400 font-bold text-xs sm:text-sm">
                        <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                        <span>{row.result}</span>
                    </span>
                );
            case 'highlight-indeterminate':
                return (
                    <div className="bg-amber-950/80 border border-amber-600/80 rounded px-3 py-1.5 inline-flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 inline-block" />
                        <span className="text-amber-300 font-extrabold text-xs sm:text-sm tracking-wider">
                            {row.result}
                        </span>
                    </div>
                );
            default:
                return <span>{row.result}</span>;
        }
    };

    // -------------------------------------------------------------
    // RENDER FOR UPLOAD MODE (INDETERMINATE / MISSING SCALE)
    // -------------------------------------------------------------
    if (mode === 'upload') {
        return (
            <div className="space-y-6 font-sans text-left max-w-4xl mx-auto pb-16">
                {/* Main Inspection Card */}
                <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400 shrink-0">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                                    PRODUCT DETECTED
                                </h3>
                                <p className="text-sm font-semibold text-slate-300 mt-0.5">
                                    Sunfeast Dark Fantasy Choco Fills
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
                            {imagesCount > 0 ? imagesCount : 5} Images Received
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm text-left">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                                    <th className="py-3 px-3">CHECK</th>
                                    <th className="py-3 px-3 text-right">RESULT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {uploadCheckTableData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 px-3 font-semibold text-slate-200">
                                            {row.check}
                                        </td>
                                        <td className="py-2.5 px-3 text-right">
                                            {renderResultCell(row)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Compliance Result Card */}
                <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                LMCY — Compliance Result
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-700/80 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                            INDETERMINATE
                        </div>
                    </div>

                    <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3.5 text-xs sm:text-sm text-amber-200 space-y-1">
                        <p className="font-bold text-amber-300 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Reason:
                        </p>
                        <p className="font-medium text-slate-200 pl-6">
                            Reference scale not detected
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                            Declarations Extracted:
                        </h4>

                        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                IMAGE ANALYSIS
                            </p>
                            <div className="space-y-2.5 divide-y divide-slate-800/70 text-xs sm:text-sm">
                                {uploadImageAnalysisRows.map((item, index) => (
                                    <div key={index} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${
                                                item.status === 'emerald' ? 'bg-emerald-500' : 'bg-amber-400'
                                            }`} />
                                            <span className="font-bold text-slate-200">{item.img}</span>
                                            <span className="text-slate-400 font-medium">({item.type})</span>
                                        </div>
                                        <span className="font-semibold text-slate-300 text-right">
                                            {item.note}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 text-xs sm:text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200">
                                <div><span className="font-semibold text-slate-400">Brand:</span> Sunfeast</div>
                                <div><span className="font-semibold text-slate-400">Product:</span> Dark Fantasy Choco Fills</div>
                                <div><span className="font-semibold text-slate-400">Net Weight:</span> 460 g</div>
                                <div><span className="font-semibold text-slate-400">MRP:</span> ₹___</div>
                                <div className="sm:col-span-2"><span className="font-semibold text-slate-400">Manufacturer/Marketed By:</span> ITC Ltd.</div>
                                <div><span className="font-semibold text-slate-400">FSSAI License:</span> <span className="text-emerald-400 font-semibold">Detected</span></div>
                                <div><span className="font-semibold text-slate-400">Batch No.:</span> <span className="text-emerald-400 font-semibold">Detected</span></div>
                                <div><span className="font-semibold text-slate-400">Barcode:</span> <span className="text-emerald-400 font-semibold">Detected</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-5 space-y-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200">
                            <RefreshCw className="w-4 h-4 text-blue-400" />
                            Recommended Action:
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium pl-6">
                            Capture again with ArUco reference marker
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsReportOpen(true)}
                                className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors border border-emerald-600"
                            >
                                <FileText className="w-4 h-4 text-white" /> Generate Official Inspection Report (PDF)
                            </button>
                            <button
                                type="button"
                                onClick={onRescanArUco}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" /> Re-Scan with ArUco
                            </button>
                            <button
                                type="button"
                                onClick={onSendForReview}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-colors"
                            >
                                <Send className="w-4 h-4 text-slate-400" /> Send for Officer Review
                            </button>
                        </div>
                    </div>
                </div>

                {/* Inspection Report Modal */}
                <InspectionReportModal
                    isOpen={isReportOpen}
                    onClose={() => setIsReportOpen(false)}
                    mode={mode}
                    capturedImages={capturedImages}
                    extractedData={extractedData}
                    user={user}
                />
            </div>
        );
    }

    // -------------------------------------------------------------
    // RENDER FOR CAMERA MODE (MAYORA CHOKI CHOKI ROLLZ - COMPLIANT)
    // -------------------------------------------------------------
    return (
        <div className="space-y-6 font-sans text-left max-w-4xl mx-auto pb-16">
            {/* Card 1: Product Detected Matrix */}
            <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400 shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-100 uppercase tracking-wider">
                                PRODUCT DETECTED
                            </h3>
                            <p className="text-sm font-bold text-slate-200 mt-0.5">
                                Mayora Choki Choki Rollz
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                                Choco-Filled Wafer Stick
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3.5 py-1.5 rounded-md border border-slate-700">
                        {imagesCount > 0 ? imagesCount : 2} Images Received
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                                <th className="py-3 px-3">CHECK</th>
                                <th className="py-3 px-3 text-right">RESULT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                            {cameraCheckTableData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                                        {row.check}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                        {row.status === 'emerald' ? (
                                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                                                <span>{row.result}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-blue-400 font-bold text-xs sm:text-sm">
                                                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                                                <span>{row.result}</span>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card 2: Image Analysis Breakdown */}
            <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Camera className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-wider">
                        IMAGE ANALYSIS
                    </h4>
                </div>

                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4">
                    <div className="space-y-3 divide-y divide-slate-800/80 text-xs sm:text-sm">
                        {cameraImageAnalysisRows.map((item, index) => (
                            <div key={index} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                                    <span className="font-bold text-slate-100">{item.img}</span>
                                    <span className="text-slate-400 font-medium">({item.type})</span>
                                </div>
                                <span className="font-semibold text-emerald-400 text-right">
                                    {item.note}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card 3: Extracted Declarations */}
            <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ClipboardList className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-wider">
                        EXTRACTED DECLARATIONS
                    </h4>
                </div>

                <div className="bg-slate-950 rounded-lg border border-slate-800/80 p-5 text-xs sm:text-sm font-sans">
                    <div className="space-y-3.5 text-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><span className="font-semibold text-slate-400">Brand:</span> <span className="font-bold text-slate-100">Mayora</span></div>
                            <div><span className="font-semibold text-slate-400">Product:</span> <span className="font-bold text-slate-100">Choki Choki Rollz</span></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><span className="font-semibold text-slate-400">Net Quantity:</span> <span className="font-bold text-slate-100">45 g</span></div>
                            <div><span className="font-semibold text-slate-400">MRP:</span> <span className="font-bold text-slate-100">₹30.00</span></div>
                        </div>

                        <div>
                            <span className="font-semibold text-slate-400">Unit Sale Price:</span> <span className="font-bold text-slate-100">₹0.67/g</span>
                        </div>

                        <div>
                            <span className="font-semibold text-slate-400">Manufactured By:</span> <span className="font-bold text-slate-100">Yummy Food Specialities Private Limited</span>
                        </div>

                        <div>
                            <span className="font-semibold text-slate-400">Marketed By:</span> <span className="font-bold text-slate-100">Mayora India Private Limited</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><span className="font-semibold text-slate-400">Country:</span> <span className="font-bold text-slate-100">India</span></div>
                            <div><span className="font-semibold text-slate-400">FSSAI License:</span> <span className="font-bold text-emerald-400">Detected</span></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><span className="font-semibold text-slate-400">Lot No.:</span> <span className="font-bold text-slate-100">MY25076240</span></div>
                            <div><span className="font-semibold text-slate-400">MFD:</span> <span className="font-bold text-slate-100">25 JUL 2026</span></div>
                        </div>

                        <div>
                            <span className="font-semibold text-slate-400">Use By:</span> <span className="font-bold text-slate-100">24 JUL 2027</span>
                        </div>

                        <div>
                            <span className="font-semibold text-slate-400">Barcode:</span> <span className="font-bold text-slate-100">8996001135719</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 4: Declaration Measurement Table */}
            <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Ruler className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-wider">
                        DECLARATION MEASUREMENT
                    </h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                                <th className="py-2.5 px-3">Declaration</th>
                                <th className="py-2.5 px-3 text-center">Detected Size</th>
                                <th className="py-2.5 px-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                            {cameraDeclarationMeasurements.map((m, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                                        {m.declaration}
                                    </td>
                                    <td className="py-2.5 px-3 text-center font-bold text-slate-100">
                                        {m.size}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                                            <span>{m.status}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overall COMPLIANT Banner Button */}
            <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Legal Metrology Compliance
                        </p>
                        <p className="text-sm font-bold text-slate-100">
                            All Rule 6 & Rule 9 Declarations Verified
                        </p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-white inline-block animate-pulse" />
                    COMPLIANT
                </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors border border-emerald-600"
                >
                    <FileText className="w-4 h-4 text-white" /> Generate Official Inspection Report (PDF)
                </button>
                <button
                    type="button"
                    onClick={onRescanArUco}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-colors"
                >
                    <Trash2 className="w-4 h-4 text-slate-400" /> Discard Audit Scan
                </button>
                <button
                    type="button"
                    onClick={onSendForReview}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                    <Save className="w-4 h-4" /> Save Audit Record
                </button>
            </div>

            {/* Inspection Report Modal */}
            <InspectionReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                mode={mode}
                capturedImages={capturedImages}
                extractedData={extractedData}
                user={user}
            />
        </div>
    );
};

export default UploadedAnalysisResult;
