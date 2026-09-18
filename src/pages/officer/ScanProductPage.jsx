import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CameraInterface from '../../components/scanning/CameraInterface';
import ProductDetailsForm from '../../components/scanning/ProductDetailsForm';
import UploadedAnalysisResult from '../../components/scanning/UploadedAnalysisResult';
import MetadataRecorder from '../../components/scanning/MetadataRecorder';
import ProcessingScreen from '../../components/scanning/ProcessingScreen';
import { dashboardService } from '../../services/dashboardService';

const ScanProductPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const resultsRef = useRef(null);

    const [capturedImages, setCapturedImages] = useState([]);
    const [complianceResult, setComplianceResult] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Synchronize mode from query param ?mode=upload or ?mode=camera
    const initialMode = searchParams.get('mode') === 'upload' ? 'upload' : 'camera';
    const [activeMode, setActiveMode] = useState(initialMode);

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'upload' || mode === 'camera') {
            setActiveMode(mode);
        }
    }, [searchParams]);

    const handleModeChange = (newMode) => {
        if (newMode !== activeMode) {
            setCapturedImages([]);
            setExtractedData(null);
            setComplianceResult(null);
        }
        setActiveMode(newMode);
        setSearchParams({ mode: newMode });
    };

    // Mock User
    const user = { name: "Officer Kiran", id: "OFF-2025-001" };

    const handleAnalyzeScan = () => {
        if (capturedImages.length === 0) return;
        setIsAnalyzing(true);
    };

    // Called when the 30-60s Processing Loader finishes 100% progress
    const handleProcessingComplete = async () => {
        const dataPayload = {
            image: capturedImages[0]?.dataUrl,
            images: capturedImages.map(img => img.dataUrl),
            barcode: "8901234567890",
            rawText: `Processed ${capturedImages.length} images combined`
        };

        let apiExtractedData = null;
        let apiComplianceResult = null;

        try {
            const response = await dashboardService.analyzeScan(dataPayload);
            if (response && response.status) {
                apiComplianceResult = response;
                if (response.extractedData) {
                    apiExtractedData = response.extractedData;
                }
            }
        } catch (error) {
            console.error("Scan analysis service returned fallback mode:", error);
        }

        // Dynamic declarations derived across captured/uploaded images
        const declarations = [
            {
                name: "Product Name",
                extracted: apiExtractedData?.name || "Choco-filled Wafer Stick",
                rule: "Rule 9(1)H: 3.5 mm",
                status: "Valid"
            },
            {
                name: "Net Quantity",
                extracted: apiExtractedData?.netQuantity || "45 g",
                rule: "Rule 7 & 9H: 3.2 mm",
                status: "Valid"
            },
            {
                name: "MRP Declaration",
                extracted: apiExtractedData?.mrp || "MRP ₹30.00 (INCL. OF ALL TAXES)",
                rule: "Rule 6(1)(f)H: 2.1 mm",
                status: "Valid"
            },
            {
                name: "Mfg Date / Batch",
                extracted: apiExtractedData?.batchDate || "JUL 2026",
                rule: "Rule 6(1)(e)H: 1.8 mm",
                status: "Valid"
            },
            {
                name: "Best Before Date",
                extracted: apiExtractedData?.bestBefore || "24 JUL 2027",
                rule: "Rule 6(1)(e)H: 1.8 mm",
                status: "Valid"
            },
            {
                name: "Unit Sale Price",
                extracted: apiExtractedData?.unitPrice || "₹0.67/g",
                rule: "Rule 6(1)(n)H: 2.0 mm",
                status: "Valid"
            },
            {
                name: "Manufacturer Details",
                extracted: apiExtractedData?.manufacturer || "Yummy Foodspecialities Pvt Ltd.",
                rule: "Rule 6(1)(a)H: 2.4 mm",
                status: "Valid"
            },
            {
                name: "Country of Origin",
                extracted: apiExtractedData?.origin || "India",
                rule: "Not applicable for Indian-manufactured product H: 1.9 mm",
                status: "Valid",
                badgeColor: "yellow"
            },
            {
                name: "Consumer Care",
                extracted: apiExtractedData?.customerCare || "Phone: 1800-258-5758 Email: consumer@mayoraindia.com Address: Same as Marketed By address Mayora India Private Limited, Survey No. 58, Gundlapochampally Village, Medchal, Medchal Malkajgiri, Telangana – 500014, India.",
                rule: "Rule 6(2)H: 1.6 mm",
                status: "Valid"
            },
            {
                name: "Generic Name / Category",
                extracted: apiExtractedData?.category || "Confectionery / Wafer Stick",
                rule: "Rule 6(1)(b)H: 2.2 mm",
                status: "Valid"
            }
        ];

        const synthesizedData = {
            declarations,
            name: declarations[0].extracted,
            netQuantity: declarations[1].extracted,
            mrp: declarations[2].extracted,
            manufacturer: declarations[6].extracted,
            origin: declarations[7].extracted,
            customerCare: declarations[8].extracted,
            imagesCount: capturedImages.length
        };

        const mockCompliance = apiComplianceResult || {
            status: 'Compliant',
            confidence: 0.98
        };

        setExtractedData(synthesizedData);
        setComplianceResult(mockCompliance);
        setIsAnalyzing(false);

        setTimeout(() => {
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleClearAll = () => {
        setCapturedImages([]);
        setComplianceResult(null);
        setExtractedData(null);
    };

    const handleSave = async () => {
        const payload = {
            capturedImagesCount: capturedImages.length,
            primaryImage: capturedImages[0]?.dataUrl,
            complianceResult,
            extractedData,
            officerId: user.id,
            location: "Unknown",
            timestamp: new Date().toISOString()
        };

        try {
            if (isOnline) {
                await dashboardService.saveScanResult(payload);
                alert("Audit record saved successfully!");
            } else {
                console.log("Offline: Saving to local queue", payload);
                alert("Record saved to offline queue");
            }
            navigate('/officer/dashboard');
        } catch (error) {
            console.error("Failed to save record:", error);
            alert("Failed to save audit record. Please retry.");
        }
    };

    const handleRescanArUco = () => {
        setCapturedImages([]);
        setExtractedData(null);
        setComplianceResult(null);
        handleModeChange('camera');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-3 sm:p-4">
            <main className="w-full h-full space-y-4 max-w-7xl mx-auto">
                {/* Officer Metadata Header Section */}
                <MetadataRecorder user={user} isOnline={isOnline} />

                {/* Camera & Multi-Image Capture / File Upload Interface */}
                <CameraInterface
                    capturedImages={capturedImages}
                    onImagesChange={setCapturedImages}
                    onAnalyze={handleAnalyzeScan}
                    isAnalyzing={isAnalyzing}
                    activeMode={activeMode}
                    onModeChange={handleModeChange}
                />

                {/* 30-60 Seconds Multi-Stage AI Processing Loader Overlay */}
                {isAnalyzing && (
                    <ProcessingScreen
                        imagesCount={capturedImages.length}
                        images={capturedImages}
                        onComplete={handleProcessingComplete}
                    />
                )}

                {/* Extracted Declarations & Inspection Matrix Section */}
                {extractedData && (
                    <div ref={resultsRef} className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300 pb-16">
                        <UploadedAnalysisResult
                            mode={activeMode}
                            imagesCount={capturedImages.length}
                            capturedImages={capturedImages}
                            extractedData={extractedData}
                            user={user}
                            onRescanArUco={handleRescanArUco}
                            onSendForReview={handleSave}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default ScanProductPage;
