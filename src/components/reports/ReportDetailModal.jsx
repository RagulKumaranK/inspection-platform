import React, { useState } from 'react';
import {
    X,
    Download,
    Printer,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    FileText,
    QrCode,
    Calendar,
    Building2,
    Tag,
    ExternalLink,
    Eye,
    Layers
} from 'lucide-react';

const ReportDetailModal = ({ report, onClose, onDownload }) => {
    const [activeTab, setActiveTab] = useState('declarations');
    const [selectedImage, setSelectedImage] = useState(0);

    if (!report) return null;

    const isCompliant = report.overallStatus === 'Compliant';

    const getStatusBadge = () => {
        if (isCompliant) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Compliant</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Non-Compliant (Violation Flagged)</span>
            </span>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-gray-900 dark:text-gray-100">
                
                {/* Modal Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary-600/20">
                            LM
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                                    Inspection Report: {report.id}
                                </h2>
                                {getStatusBadge()}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Directorate of Legal Metrology • Government of India Audit Record
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Metadata Overview Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700/80 text-xs">
                        <div className="space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Product Name
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white text-sm block truncate" title={report.productName}>
                                {report.productName}
                            </span>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                                {report.category}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Manufacturer / Company
                            </span>
                            <span className="font-bold text-gray-800 dark:text-gray-200 block truncate" title={report.company}>
                                {report.company}
                            </span>
                            <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium">
                                Platform: {report.platform}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Scan Date & Time
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-gray-800 dark:text-gray-200 font-semibold">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span>{report.scanDateTime}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-gray-500 dark:text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                                Risk Level / Status
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                    report.riskLevel === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                    report.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                    report.riskLevel === 'Low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                }`}>
                                    Risk: {report.riskLevel}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Primary Violation Banner (if non-compliant) */}
                    {!isCompliant && (
                        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 space-y-1">
                            <div className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
                                <AlertTriangle className="w-4 h-4 text-rose-600" />
                                <span>Primary Violation Detected: {report.primaryViolation}</span>
                            </div>
                            <p className="text-xs text-rose-800 dark:text-rose-300/90 leading-relaxed">
                                {report.violationDetail}
                            </p>
                        </div>
                    )}

                    {/* Product Packaging Scan Images */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-primary-500" />
                            <span>Product Packaging Scans ({report.productImages.length} Views)</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {report.productImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`
                                        p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2
                                        ${selectedImage === idx
                                            ? 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-500 ring-2 ring-primary-500/20'
                                            : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {/* Mock Product Thumbnail SVG Graphic */}
                                    <div className="w-full h-24 rounded-lg bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 relative overflow-hidden border border-gray-300/60 dark:border-gray-700/60">
                                        <Layers className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                        <span className="text-[10px] font-semibold mt-1 text-gray-600 dark:text-gray-300">{img.label}</span>
                                        <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-900/60 text-white">
                                            {img.type}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{img.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Declarations & Measured Font Height Table */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-500" />
                                <span>Mandatory Declarations & Measurement Matrix</span>
                            </h3>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                Rule 6 & Rule 9 Verification
                            </span>
                        </div>

                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="p-3">Mandatory Declaration</th>
                                            <th className="p-3">Extracted Package Text</th>
                                            <th className="p-3">Applicable LM Rule</th>
                                            <th className="p-3">Measured Font Height</th>
                                            <th className="p-3 text-right">Field Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {report.extractedDeclarations.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                                                    {item.name}
                                                </td>
                                                <td className="p-3 font-mono text-gray-800 dark:text-gray-200 max-w-[200px] truncate" title={item.extracted}>
                                                    {item.extracted}
                                                </td>
                                                <td className="p-3">
                                                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                        {item.rule}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono text-gray-700 dark:text-gray-300">
                                                    {item.measurement}
                                                </td>
                                                <td className="p-3 text-right">
                                                    {item.status === 'Valid' ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                                                            <XCircle className="w-3.5 h-3.5" /> Violation
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Applicable Rules & Verifiable QR Code Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* Applicable Rules Tags */}
                        <div className="md:col-span-7 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-primary-500" />
                                <span>Applicable Legal Metrology Provisions</span>
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {report.applicableRules.map((rule, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                                    >
                                        {rule}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Official QR Verification Card */}
                        <div className="md:col-span-5 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700/80 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-white p-1.5 border border-gray-300 flex items-center justify-center flex-shrink-0 shadow-xs">
                                {/* SVG Verifiable QR Code Graphic */}
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    <rect width="100" height="100" fill="white" />
                                    <rect x="10" y="10" width="30" height="30" fill="black" />
                                    <rect x="15" y="15" width="20" height="20" fill="white" />
                                    <rect x="20" y="20" width="10" height="10" fill="black" />
                                    <rect x="60" y="10" width="30" height="30" fill="black" />
                                    <rect x="65" y="15" width="20" height="20" fill="white" />
                                    <rect x="70" y="20" width="10" height="10" fill="black" />
                                    <rect x="10" y="60" width="30" height="30" fill="black" />
                                    <rect x="15" y="65" width="20" height="20" fill="white" />
                                    <rect x="20" y="70" width="10" height="10" fill="black" />
                                    <rect x="50" y="50" width="15" height="15" fill="black" />
                                    <rect x="70" y="70" width="15" height="15" fill="black" />
                                </svg>
                            </div>

                            <div className="space-y-1 text-xs">
                                <span className="font-bold text-gray-900 dark:text-white block flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Verifiable Audit QR Code</span>
                                </span>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                                    Scan with legal metrology inspector portal to verify digital authenticity.
                                </p>
                                <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 block truncate">
                                    {report.verificationQrCode}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Modal Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        Close Window
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Report</span>
                        </button>

                        <button
                            onClick={() => onDownload(report.id)}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-sm transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Official PDF Report</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportDetailModal;
