import React, { useState, useMemo } from 'react';
import {
    Search,
    Download,
    Eye,
    Filter,
    ChevronDown,
    FileText,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { mock87Reports } from '../../data/mock87Reports';
import ReportDetailModal from '../../components/reports/ReportDetailModal';

const ReportGenerationPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Statuses');
    const [filterPlatform, setFilterPlatform] = useState('All Platforms');
    const [filterRisk, setFilterRisk] = useState('All Risks');
    const [filterCategory, setFilterCategory] = useState('All Categories');

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [selectedReport, setSelectedReport] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState({
        status: false,
        platform: false,
        risk: false,
        category: false
    });

    // 1. Filter reports based on search term & filter selections
    const filteredReports = useMemo(() => {
        return mock87Reports.filter((rpt) => {
            // Search text matching
            const matchSearch =
                searchTerm === '' ||
                rpt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rpt.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rpt.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rpt.primaryViolation.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter matching
            const matchStatus =
                filterStatus === 'All Statuses' ||
                (filterStatus === 'Compliant' && rpt.overallStatus === 'Compliant') ||
                (filterStatus === 'Non-Compliant' && rpt.overallStatus === 'Non-Compliant');

            // Platform filter matching
            const matchPlatform =
                filterPlatform === 'All Platforms' || rpt.platform === filterPlatform;

            // Risk filter matching
            const matchRisk =
                filterRisk === 'All Risks' || rpt.riskLevel === filterRisk;

            // Category filter matching
            const matchCategory =
                filterCategory === 'All Categories' || rpt.category === filterCategory;

            return matchSearch && matchStatus && matchPlatform && matchRisk && matchCategory;
        });
    }, [searchTerm, filterStatus, filterPlatform, filterRisk, filterCategory]);

    // 2. Pagination calculation
    const totalReports = filteredReports.length;
    const totalPages = pageSize === 'All' ? 1 : Math.ceil(totalReports / (pageSize || 10));
    
    const paginatedReports = useMemo(() => {
        if (pageSize === 'All') return filteredReports;
        const start = (currentPage - 1) * pageSize;
        return filteredReports.slice(start, start + pageSize);
    }, [filteredReports, currentPage, pageSize]);

    // Summary KPI metrics derived from full 87 dataset
    const totalCount = mock87Reports.length; // Exactly 87
    const compliantCount = mock87Reports.filter(r => r.overallStatus === 'Compliant').length;
    const nonCompliantCount = mock87Reports.filter(r => r.overallStatus === 'Non-Compliant').length;
    const highRiskCount = mock87Reports.filter(r => r.riskLevel === 'High').length;

    const handleDownload = (reportId) => {
        const report = mock87Reports.find(r => r.id === reportId);
        if (!report) return;

        // Generate clean text/CSV format for download demo
        const reportContent = `
PRODUCT COMPLIANCE INSPECTION REPORT
----------------------------------
Report ID: ${report.id}
Product: ${report.productName}
Manufacturer: ${report.company}
Platform: ${report.platform}
Scan Date & Time: ${report.scanDateTime}
Overall Status: ${report.overallStatus}
Risk Level: ${report.riskLevel}
Primary Violation: ${report.primaryViolation}

EXTRACTED DECLARATIONS:
${report.extractedDeclarations.map(d => `- ${d.name}: ${d.extracted} [Rule: ${d.rule} | Status: ${d.status}]`).join('\n')}

VERIFICATION LINK:
${report.verificationQrCode}
----------------------------------
Product Compliance Inspection Platform • Compliance Directorate
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LegalMetrology_${reportId}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const handleExportAll = () => {
        const headers = ['Report ID', 'Product Name', 'Manufacturer', 'Category', 'Platform', 'Scan Date Time', 'Overall Status', 'Risk Level', 'Primary Violation'];
        const rows = filteredReports.map(r => [
            r.id,
            `"${r.productName.replace(/"/g, '""')}"`,
            `"${r.company.replace(/"/g, '""')}"`,
            r.category,
            r.platform,
            r.scanDateTime,
            r.overallStatus,
            r.riskLevel,
            `"${r.primaryViolation.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Legal_Metrology_All_87_Reports_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const getRiskBadge = (risk) => {
        const styles = {
            High: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
            Medium: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
            Low: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
            Pass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${styles[risk] || 'bg-gray-100'}`}>
                {risk}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        if (status === 'Compliant') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Compliant</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Violation</span>
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-gray-100">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            <span>Product Compliance Inspection Reports</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Showing complete database of <span className="font-bold text-gray-900 dark:text-white">{totalCount} official inspection records</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportAll}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-xs text-gray-800 dark:text-gray-200"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export All 87 Reports (CSV)</span>
                        </button>
                    </div>
                </div>

                {/* Summary KPI Cards Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Reports</span>
                        <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">{totalCount}</div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">100% Audit Coverage</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-1">
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">Compliant Listings</span>
                        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{compliantCount}</div>
                        <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Valid Declarations</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-1">
                        <span className="text-xs text-rose-700 dark:text-rose-400 font-semibold uppercase tracking-wider">Violations Flagged</span>
                        <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">{nonCompliantCount}</div>
                        <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-medium">Rule 6 & Rule 9 Non-Compliant</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-1">
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">High Risk Priority</span>
                        <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{highRiskCount}</div>
                        <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">Requires Notice Issuance</span>
                    </div>
                </div>

                {/* Search & Filters Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs space-y-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Report ID, Product Name, Brand, Category, or Violation..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Filter Dropdowns */}
                        <div className="flex flex-wrap gap-2">

                            {/* Status Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen({ ...isDropdownOpen, status: !isDropdownOpen.status })}
                                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[140px]"
                                >
                                    <span>{filterStatus}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {isDropdownOpen.status && (
                                    <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-30 py-1 text-xs">
                                        {['All Statuses', 'Compliant', 'Non-Compliant'].map(st => (
                                            <button
                                                key={st}
                                                onClick={() => {
                                                    setFilterStatus(st);
                                                    setCurrentPage(1);
                                                    setIsDropdownOpen({ ...isDropdownOpen, status: false });
                                                }}
                                                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                {st}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Risk Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen({ ...isDropdownOpen, risk: !isDropdownOpen.risk })}
                                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[130px]"
                                >
                                    <span>{filterRisk}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {isDropdownOpen.risk && (
                                    <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-30 py-1 text-xs">
                                        {['All Risks', 'High', 'Medium', 'Low', 'Pass'].map(rk => (
                                            <button
                                                key={rk}
                                                onClick={() => {
                                                    setFilterRisk(rk);
                                                    setCurrentPage(1);
                                                    setIsDropdownOpen({ ...isDropdownOpen, risk: false });
                                                }}
                                                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                {rk}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Platform Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen({ ...isDropdownOpen, platform: !isDropdownOpen.platform })}
                                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[150px]"
                                >
                                    <span>{filterPlatform}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {isDropdownOpen.platform && (
                                    <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-30 py-1 text-xs">
                                        {['All Platforms', 'Amazon', 'Flipkart', 'Blinkit', 'Swiggy Instamart', 'BigBasket', 'JioMart', 'Myntra'].map(pf => (
                                            <button
                                                key={pf}
                                                onClick={() => {
                                                    setFilterPlatform(pf);
                                                    setCurrentPage(1);
                                                    setIsDropdownOpen({ ...isDropdownOpen, platform: false });
                                                }}
                                                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                {pf}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen({ ...isDropdownOpen, category: !isDropdownOpen.category })}
                                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[150px]"
                                >
                                    <span>{filterCategory}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {isDropdownOpen.category && (
                                    <div className="absolute top-full mt-1 w-[180px] right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-30 py-1 text-xs max-h-60 overflow-y-auto">
                                        {['All Categories', 'Food & Beverages', 'Edible Oils', 'Confectionery', 'Personal Care', 'Household & Cleaning', 'Baby Care', 'Cosmetics'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setFilterCategory(cat);
                                                    setCurrentPage(1);
                                                    setIsDropdownOpen({ ...isDropdownOpen, category: false });
                                                }}
                                                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Reports Table Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/60 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <th className="p-4">Report ID</th>
                                    <th className="p-4">Product Name & Company</th>
                                    <th className="p-4">Platform</th>
                                    <th className="p-4">Primary Inspection Finding</th>
                                    <th className="p-4">Risk Level</th>
                                    <th className="p-4">Scan Date & Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs">
                                {paginatedReports.length > 0 ? (
                                    paginatedReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="group hover:bg-primary-50/30 dark:hover:bg-gray-700/40 transition-colors"
                                        >
                                            <td className="p-4 font-mono font-bold text-gray-900 dark:text-gray-100">
                                                {report.id}
                                            </td>

                                            <td className="p-4 max-w-[260px]">
                                                <div className="space-y-0.5">
                                                    <span
                                                        onClick={() => setSelectedReport(report)}
                                                        className="font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors block truncate"
                                                        title={report.productName}
                                                    >
                                                        {report.productName}
                                                    </span>
                                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate" title={report.company}>
                                                        {report.company}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold">
                                                    {report.platform}
                                                </span>
                                            </td>

                                            <td className="p-4 max-w-[200px]">
                                                <span className="font-medium text-gray-800 dark:text-gray-200 block truncate" title={report.primaryViolation}>
                                                    {report.primaryViolation}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                {getRiskBadge(report.riskLevel)}
                                            </td>

                                            <td className="p-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {report.scanDateTime}
                                            </td>

                                            <td className="p-4">
                                                {getStatusBadge(report.overallStatus)}
                                            </td>

                                            <td className="p-4 text-right whitespace-nowrap space-x-2">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                                    title="View complete report details"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View Details</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDownload(report.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors shadow-xs"
                                                    title="Download report file"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>Report</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Filter className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                <p className="font-semibold text-sm">No reports matching your search or filters.</p>
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setFilterStatus('All Statuses');
                                                        setFilterRisk('All Risks');
                                                        setFilterPlatform('All Platforms');
                                                        setFilterCategory('All Categories');
                                                    }}
                                                    className="mt-2 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                                                >
                                                    Reset all filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span>Showing</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {totalReports === 0 ? 0 : (currentPage - 1) * (pageSize === 'All' ? totalReports : pageSize) + 1}
                            </span>
                            <span>to</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {pageSize === 'All' ? totalReports : Math.min(currentPage * pageSize, totalReports)}
                            </span>
                            <span>of</span>
                            <span className="font-bold text-gray-900 dark:text-white">{totalReports}</span>
                            <span>reports</span>
                        </div>

                        {/* Page Size & Navigation Controls */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Rows per page:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        const val = e.target.value === 'All' ? 'All' : Number(e.target.value);
                                        setPageSize(val);
                                        setCurrentPage(1);
                                    }}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value="All">All 87</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1 || pageSize === 'All'}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="px-2 font-semibold text-gray-700 dark:text-gray-300">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    disabled={currentPage >= totalPages || pageSize === 'All'}
                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Interactive Report Detail Modal */}
            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onDownload={handleDownload}
                />
            )}
        </div>
    );
};

export default ReportGenerationPage;
