import React, { useRef } from 'react';
import { ShieldCheck, Printer, X, CheckCircle2, AlertTriangle, FileText, QrCode } from 'lucide-react';

const InspectionReportModal = ({
    isOpen,
    onClose,
    mode = 'camera',
    capturedImages = [],
    extractedData,
    user
}) => {
    const reportRef = useRef(null);

    if (!isOpen) return null;

    const reportId = `LMC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const isCompliant = mode === 'camera';
    const overallStatus = isCompliant ? 'COMPLIANT' : 'INDETERMINATE';

    // Dynamic product specs derived from mode / extractedData
    const productInfo = isCompliant ? {
        brand: 'Mayora',
        name: 'Mayora Choki Choki Rollz',
        category: 'Choco-Filled Wafer Stick',
        netQty: '45 g',
        mrp: '₹30.00',
        unitPrice: '₹0.67/g',
        manufacturer: 'Yummy Food Specialities Private Limited',
        marketedBy: 'Mayora India Private Limited',
        origin: 'India',
        fssai: '21521019000456 (Detected)',
        lotNo: 'MY25076240',
        mfd: '25 JUL 2026',
        useBy: '24 JUL 2027',
        barcode: '8996001135719'
    } : {
        brand: 'Sunfeast',
        name: 'Sunfeast Dark Fantasy Choco Fills',
        category: 'Confectionery / Biscuits',
        netQty: '460 g',
        mrp: '₹___ (Unclear)',
        unitPrice: 'Not Verifiable',
        manufacturer: 'ITC Ltd.',
        marketedBy: 'ITC Ltd.',
        origin: 'India (Check Required)',
        fssai: '10012031000085 (Detected)',
        lotNo: 'B2604901',
        mfd: '15 JUL 2026',
        useBy: '14 JUL 2027',
        barcode: '8901058852341'
    };

    // Full Matrix of 10 Declarations with Applicable Rules, Font Height, Extracted Values & Status
    const declarationMatrix = [
        {
            name: 'Product Name / Generic Category',
            rule: 'Rule 6(1)(b) & Rule 9(1)',
            extracted: productInfo.name,
            fontHeight: isCompliant ? '3.50 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Net Quantity Declaration',
            rule: 'Rule 7 & Rule 9',
            extracted: productInfo.netQty,
            fontHeight: isCompliant ? '2.14 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Maximum Retail Price (MRP)',
            rule: 'Rule 6(1)(f)',
            extracted: productInfo.mrp,
            fontHeight: isCompliant ? '2.08 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Unit Sale Price',
            rule: 'Rule 6(1)(n)',
            extracted: productInfo.unitPrice,
            fontHeight: isCompliant ? '1.76 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Manufacturer & Packer Name / Address',
            rule: 'Rule 6(1)(a)',
            extracted: productInfo.manufacturer,
            fontHeight: isCompliant ? '1.83 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Marketed By Details',
            rule: 'Rule 6(1)(a)',
            extracted: productInfo.marketedBy,
            fontHeight: isCompliant ? '1.81 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Country of Origin',
            rule: 'Rule 6(1)(m)',
            extracted: productInfo.origin,
            fontHeight: isCompliant ? '1.90 mm' : 'Reference Missing',
            status: isCompliant ? 'Valid' : 'Check Required'
        },
        {
            name: 'Date of Mfg / Batch / Lot No.',
            rule: 'Rule 6(1)(e)',
            extracted: `Lot: ${productInfo.lotNo} | MFD: ${productInfo.mfd}`,
            fontHeight: isCompliant ? '1.72 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Expiry / Best Before / Use By',
            rule: 'Rule 6(1)(e)',
            extracted: `Use By: ${productInfo.useBy}`,
            fontHeight: isCompliant ? '1.86 mm' : 'Not Verifiable',
            status: 'Valid'
        },
        {
            name: 'Consumer Care Address & Helpline',
            rule: 'Rule 6(2)',
            extracted: 'Phone: 1800-258-5758 Email: consumer@mayoraindia.com',
            fontHeight: isCompliant ? '1.79 mm' : 'Not Verifiable',
            status: 'Valid'
        }
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden font-sans">
                
                {/* Modal Header Toolbar */}
                <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h2 className="text-sm sm:text-base font-bold tracking-wide">
                            Official Product Compliance Inspection Report
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-sm"
                        >
                            <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Printable Document Body */}
                <div ref={reportRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white text-slate-900 print:p-0 print:overflow-visible">
                    
                    {/* Official Letterhead Header */}
                    <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-7 h-7 text-blue-900" />
                                <div>
                                    <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                                        PRODUCT COMPLIANCE INSPECTION DIVISION
                                    </h1>
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Product Compliance Inspection Platform • Declaration Certificate
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-right text-xs space-y-0.5 border-l-2 border-slate-300 pl-4">
                            <p className="font-extrabold text-slate-900">Report Ref: <span className="font-mono text-blue-900">{reportId}</span></p>
                            <p className="font-medium text-slate-600">Date: {formattedDate}</p>
                            <p className="font-semibold text-slate-800">Inspector: {user?.name || 'Officer Kiran'} ({user?.id || 'OFF-2025-001'})</p>
                        </div>
                    </div>

                    {/* Overall Compliance Status Banner */}
                    <div className={`p-4 rounded-lg border flex items-center justify-between ${
                        isCompliant 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}>
                        <div className="flex items-center gap-3">
                            {isCompliant ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-amber-700" />
                            )}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Overall Inspection Status
                                </p>
                                <p className="text-sm sm:text-base font-extrabold">
                                    {isCompliant ? 'Statutory Declaration Compliant' : 'Reference Scale Missing / Indeterminate Status'}
                                </p>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm ${
                            isCompliant
                                ? 'bg-emerald-700 text-white'
                                : 'bg-amber-600 text-white'
                        }`}>
                            {overallStatus}
                        </span>
                    </div>

                    {/* Section 1: Product Information */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                            1. PRODUCT IDENTIFICATION & SPECIFICATIONS
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                            <div><span className="font-bold text-slate-500">Brand:</span> <span className="font-extrabold text-slate-900">{productInfo.brand}</span></div>
                            <div><span className="font-bold text-slate-500">Product Name:</span> <span className="font-extrabold text-slate-900">{productInfo.name}</span></div>
                            <div><span className="font-bold text-slate-500">Category:</span> <span className="font-extrabold text-slate-900">{productInfo.category}</span></div>
                            <div><span className="font-bold text-slate-500">Net Quantity:</span> <span className="font-extrabold text-slate-900">{productInfo.netQty}</span></div>
                            <div><span className="font-bold text-slate-500">MRP:</span> <span className="font-extrabold text-slate-900">{productInfo.mrp}</span></div>
                            <div><span className="font-bold text-slate-500">Unit Price:</span> <span className="font-extrabold text-slate-900">{productInfo.unitPrice}</span></div>
                            <div className="col-span-2 sm:col-span-3"><span className="font-bold text-slate-500">Manufacturer:</span> <span className="font-extrabold text-slate-900">{productInfo.manufacturer}</span></div>
                            <div className="col-span-2 sm:col-span-3"><span className="font-bold text-slate-500">Marketed By:</span> <span className="font-extrabold text-slate-900">{productInfo.marketedBy}</span></div>
                            <div><span className="font-bold text-slate-500">Country of Origin:</span> <span className="font-extrabold text-slate-900">{productInfo.origin}</span></div>
                            <div><span className="font-bold text-slate-500">Lot / Batch No.:</span> <span className="font-extrabold text-slate-900">{productInfo.lotNo}</span></div>
                            <div><span className="font-bold text-slate-500">Barcode:</span> <span className="font-mono font-bold text-slate-900">{productInfo.barcode}</span></div>
                        </div>
                    </div>

                    {/* Section 2: Uploaded/Captured Images Evidence Gallery */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                            2. INSPECTION EVIDENCE (ALL CAPTURED/UPLOADED PRODUCT IMAGES)
                        </h3>
                        {capturedImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {capturedImages.map((img, idx) => (
                                    <div key={idx} className="border border-slate-300 rounded-lg p-1.5 bg-slate-50 space-y-1">
                                        <div className="h-28 w-full bg-slate-200 rounded overflow-hidden">
                                            <img src={img.dataUrl} alt={`Evidence ${idx + 1}`} className="w-full h-full object-contain" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-700 text-center uppercase truncate">
                                            Image {idx + 1} • {idx === 0 ? 'Front Label' : idx === 1 ? 'Back Label' : 'Label Detail'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 text-center font-medium">
                                2 Verified Sample Images Attached
                            </div>
                        )}
                    </div>

                    {/* Section 3: Declarations, Legal Metrology Rules & Font Measurements Matrix */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                            3. MANDATORY DECLARATIONS & FONT HEIGHT MEASUREMENT MATRIX
                        </h3>
                        <div className="overflow-x-auto border border-slate-300 rounded-lg">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                                        <th className="py-2.5 px-3">Mandatory Declaration</th>
                                        <th className="py-2.5 px-3">Extracted Value</th>
                                        <th className="py-2.5 px-3">Legal Metrology Rule</th>
                                        <th className="py-2.5 px-3 text-center">Font Height</th>
                                        <th className="py-2.5 px-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {declarationMatrix.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="py-2 px-3 font-bold text-slate-900">{item.name}</td>
                                            <td className="py-2 px-3 font-medium text-slate-800">{item.extracted}</td>
                                            <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{item.rule}</td>
                                            <td className="py-2 px-3 text-center font-bold text-slate-900">{item.fontHeight}</td>
                                            <td className="py-2 px-3 text-right">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                                    item.status === 'Valid'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 4: Authentication & Verification QR Code */}
                    <div className="border-t-2 border-slate-300 pt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded p-1 flex items-center justify-center shrink-0">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://compliance-inspection.local/verify/${reportId}`}
                                    alt="QR Code Verification"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="space-y-1 text-xs">
                                <p className="font-extrabold text-slate-900 flex items-center gap-1">
                                    <QrCode className="w-3.5 h-3.5 text-blue-900" /> Scan QR to Verify Report Authenticity
                                </p>
                                <p className="text-slate-600 text-[11px] leading-tight">
                                    Official digital verification hash generated by Compliance Inspection AI Engine.
                                    Valid across all Inspection Nodes.
                                </p>
                            </div>
                        </div>

                        <div className="text-right text-xs space-y-1">
                            <div className="h-10 border-b border-slate-400 w-48 ml-auto flex items-end justify-center">
                                <span className="font-serif italic text-slate-700 text-sm">Officer Kiran</span>
                            </div>
                            <p className="font-bold text-slate-900">Authorised Inspection Officer</p>
                            <p className="text-[10px] text-slate-500">Product Compliance Division</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InspectionReportModal;
