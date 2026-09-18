import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ProductDetailsForm = ({ data }) => {
    // Standard declarations schema
    const defaultDeclarations = [
        {
            key: 'name',
            name: 'Product Name',
            extracted: data?.name || 'Choco-filled Wafer Stick',
            rule: 'Rule 9(1)H: 3.5 mm',
            status: 'Valid'
        },
        {
            key: 'netQuantity',
            name: 'Net Quantity',
            extracted: data?.netQuantity || '45 g',
            rule: 'Rule 7 & 9H: 3.2 mm',
            status: 'Valid'
        },
        {
            key: 'mrp',
            name: 'MRP Declaration',
            extracted: data?.mrp || 'MRP ₹30.00 (INCL. OF ALL TAXES)',
            rule: 'Rule 6(1)(f)H: 2.1 mm',
            status: 'Valid'
        },
        {
            key: 'batchDate',
            name: 'Mfg Date / Batch',
            extracted: data?.batchDate || 'JUL 2026',
            rule: 'Rule 6(1)(e)H: 1.8 mm',
            status: 'Valid'
        },
        {
            key: 'bestBefore',
            name: 'Best Before Date',
            extracted: data?.bestBefore || '24 JUL 2027',
            rule: 'Rule 6(1)(e)H: 1.8 mm',
            status: 'Valid'
        },
        {
            key: 'unitPrice',
            name: 'Unit Sale Price',
            extracted: data?.unitPrice || '₹0.67/g',
            rule: 'Rule 6(1)(n)H: 2.0 mm',
            status: 'Valid'
        },
        {
            key: 'manufacturer',
            name: 'Manufacturer Details',
            extracted: data?.manufacturer || 'Yummy Foodspecialities Pvt Ltd.',
            rule: 'Rule 6(1)(a)H: 2.4 mm',
            status: 'Valid'
        },
        {
            key: 'origin',
            name: 'Country of Origin',
            extracted: data?.origin || 'India',
            rule: 'Not applicable for Indian-manufactured product H: 1.9 mm',
            status: 'Valid',
            badgeColor: 'yellow'
        },
        {
            key: 'customerCare',
            name: 'Consumer Care',
            extracted: data?.customerCare || 'Phone: 1800-258-5758 Email: consumer@mayoraindia.com Address: Same as Marketed By address Mayora India Private Limited, Survey No. 58, Gundlapochampally Village, Medchal, Medchal Malkajgiri, Telangana – 500014, India.',
            rule: 'Rule 6(2)H: 1.6 mm',
            status: 'Valid'
        },
        {
            key: 'category',
            name: 'Generic Name / Category',
            extracted: data?.category || 'Confectionery / Wafer Stick',
            rule: 'Rule 6(1)(b)H: 2.2 mm',
            status: 'Valid'
        }
    ];

    const declarationsList = data?.declarations || defaultDeclarations;

    const totalCount = declarationsList.length;
    const passedCount = declarationsList.filter(d => d.status === 'Valid' || d.status === 'Compliant').length;

    return (
        <div className="space-y-4 font-sans">
            {/* Overall Product Compliance Status Banner Button */}
            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-lg p-3.5 shadow-sm text-left">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Overall Compliance Status
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            Legal Metrology Rules 2011 Verified
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm transition-colors cursor-default"
                >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    COMPLIANT
                </button>
            </div>

            {/* Top Summary Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm text-left">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        TOTAL DECLARATIONS
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                        {totalCount}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm text-left">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        PASSED DECLARATIONS
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {passedCount}
                    </p>
                </div>
            </div>

            {/* Extracted Declarations Header & Cards List */}
            <div className="space-y-4 text-left">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                    Extracted Declarations
                </h3>

                <div className="space-y-3">
                    {declarationsList.map((item, index) => {
                        const isCountryOfOrigin = item.name === 'Country of Origin' || item.key === 'origin';
                        const isValid = item.status === 'Valid' || item.status === 'Compliant' || isCountryOfOrigin;
                        const isYellow = item.badgeColor === 'yellow' || item.isYellow || isCountryOfOrigin;

                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-2"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {item.name}
                                    </h4>
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded ${
                                            isYellow
                                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                                                : isValid
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                        }`}
                                    >
                                        {isValid ? (
                                            <>
                                                <CheckCircle2 className={`w-3.5 h-3.5 ${isYellow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`} /> Valid
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Violation
                                            </>
                                        )}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                                    <span className="font-semibold text-slate-600 dark:text-slate-400">Extracted:</span> "{item.extracted}"
                                </p>

                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    {item.rule}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsForm;
