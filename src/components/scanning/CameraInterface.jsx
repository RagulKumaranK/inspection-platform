import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Zap, Trash2, Plus, Eye, X, CheckCircle, AlertCircle, Upload, SwitchCamera, RotateCcw } from 'lucide-react';

const CameraInterface = ({
    onImagesChange,
    capturedImages = [],
    onAnalyze,
    isAnalyzing = false,
    activeMode = 'camera',
    onModeChange
}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [cameraStream, setCameraStream] = useState(null);
    const [cameraStatus, setCameraStatus] = useState('initializing'); // 'initializing' | 'active' | 'denied' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
    const [flashOn, setFlashOn] = useState(false);
    const [shutterEffect, setShutterEffect] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [retakeIndex, setRetakeIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Request & Initialize Camera Stream
    const startCamera = async (mode = facingMode) => {
        if (activeMode !== 'camera') return;
        setCameraStatus('initializing');
        setErrorMessage('');

        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API is not available in this browser environment.");
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: mode },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });

            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraStatus('active');
        } catch (err) {
            console.error("Camera access error:", err);
            setCameraStatus('denied');
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setErrorMessage('Camera permission required for live scanning. Please enable camera access in browser settings.');
            } else {
                setErrorMessage(err.message || 'Unable to start camera stream.');
            }
        }
    };

    useEffect(() => {
        if (activeMode === 'camera') {
            startCamera(facingMode);
        } else {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                setCameraStream(null);
            }
        }
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode, activeMode]);

    useEffect(() => {
        if (activeMode === 'camera' && cameraStatus === 'active' && videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [activeMode, cameraStatus, cameraStream]);

    // Toggle Front / Back Camera
    const toggleCameraMode = () => {
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
    };

    // Toggle Flash/Torch if supported
    const toggleFlash = async () => {
        if (!cameraStream) return;
        const track = cameraStream.getVideoTracks()[0];
        if (track && track.getCapabilities && track.getCapabilities().torch) {
            try {
                await track.applyConstraints({
                    advanced: [{ torch: !flashOn }]
                });
                setFlashOn(!flashOn);
            } catch (e) {
                setFlashOn(!flashOn);
            }
        } else {
            setFlashOn(!flashOn);
        }
    };

    // Capture Image from live camera
    const handleCaptureImage = () => {
        setShutterEffect(true);
        setTimeout(() => setShutterEffect(false), 150);

        let dataUrl = null;

        if (cameraStatus === 'active' && videoRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current || document.createElement('canvas');
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        } else {
            // Fallback canvas if camera stream is unavailable
            const canvas = canvasRef.current || document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText('PRODUCT LABEL SCAN #' + (capturedImages.length + 1), 220, 280);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px sans-serif';
            ctx.fillText('Timestamp: ' + new Date().toLocaleTimeString(), 250, 320);
            dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        }

        const newImage = {
            id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            dataUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        if (retakeIndex !== null) {
            const updated = [...capturedImages];
            updated[retakeIndex] = newImage;
            onImagesChange(updated);
            setRetakeIndex(null);
        } else {
            onImagesChange([...capturedImages, newImage]);
        }
    };

    // Handle File Selection / Drag-Drop
    const handleFileUpload = (e) => {
        const rawFiles = e.target.files ? Array.from(e.target.files) : [];
        if (rawFiles.length === 0) return;

        let processedCount = 0;
        const newImages = [];

        rawFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImg = {
                    id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                    dataUrl: event.target.result,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                };
                newImages.push(newImg);
                processedCount++;

                if (processedCount === rawFiles.length) {
                    if (retakeIndex !== null) {
                        onImagesChange(prev => {
                            const copy = [...prev];
                            copy[retakeIndex] = newImages[0];
                            return copy;
                        });
                        setRetakeIndex(null);
                    } else {
                        onImagesChange(prev => [...prev, ...newImages]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });

        if (e.target) e.target.value = '';
    };

    const removeImage = (idToRemove) => {
        onImagesChange(capturedImages.filter(img => img.id !== idToRemove));
        if (previewImage && previewImage.id === idToRemove) {
            setPreviewImage(null);
        }
    };

    const triggerRetake = (index) => {
        setRetakeIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-4 font-sans">
            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* Mode Switcher Header */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <button
                        type="button"
                        onClick={() => onModeChange && onModeChange('camera')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                            activeMode === 'camera'
                                ? 'border-blue-700 text-blue-700 bg-white dark:bg-slate-800 dark:text-blue-400 dark:border-blue-400 font-bold'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <Camera className="w-4 h-4" />
                        <span>Live Camera Capture</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onModeChange && onModeChange('upload')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                            activeMode === 'upload'
                                ? 'border-blue-700 text-blue-700 bg-white dark:bg-slate-800 dark:text-blue-400 dark:border-blue-400 font-bold'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image Files</span>
                    </button>
                </div>

                {/* Retake Notice */}
                {retakeIndex !== null && (
                    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 px-4 py-2 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            <span>Replacing Image #{retakeIndex + 1}. Capture or select a new photo.</span>
                        </div>
                        <button
                            onClick={() => setRetakeIndex(null)}
                            className="font-bold underline hover:text-amber-900"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Active Interface Area */}
                <div className="p-3 sm:p-4">
                    {activeMode === 'upload' ? (
                        /* Professional File Upload Dropzone */
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                    handleFileUpload({ target: { files: e.dataTransfer.files } });
                                }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`rounded-lg p-8 sm:p-10 border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                                isDragging
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Upload Product Packaging Images
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                    Drag & drop multiple product label photos here, or click to browse files.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="mt-1 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" /> Select Image Files
                            </button>
                            <span className="text-[11px] text-slate-400 font-medium">Accepted formats: JPG, PNG, WEBP</span>
                        </div>
                    ) : (
                        /* Native Mobile Camera Viewport UI */
                        <div className="bg-black rounded-2xl overflow-hidden relative h-[440px] sm:h-[480px] w-full border-2 border-slate-800 shadow-2xl flex flex-col justify-between select-none max-w-md mx-auto">
                            {shutterEffect && (
                                <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150 pointer-events-none" />
                            )}

                            {/* Camera Video Stream & Error State */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                                {cameraStatus === 'active' ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover scale-105"
                                    />
                                ) : cameraStatus === 'initializing' ? (
                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                                        <span className="text-xs font-medium text-white">Opening mobile camera...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-3">
                                        <AlertCircle className="w-10 h-10 text-amber-500" />
                                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Camera Access Needed</h4>
                                        <p className="text-xs text-slate-400 max-w-xs">
                                            {errorMessage || 'Grant camera permissions in your browser, or switch to file upload.'}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() => startCamera()}
                                                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                                            </button>
                                            <button
                                                onClick={() => onModeChange && onModeChange('upload')}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5"
                                            >
                                                <Upload className="w-3.5 h-3.5" /> File Upload
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Camera Top Controls Bar */}
                            <div className="relative z-20 p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
                                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-[11px] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>LIVE CAM</span>
                                </div>

                                <div className="text-white/90 text-xs font-bold tracking-wider uppercase drop-shadow">
                                    Label Scan
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={toggleCameraMode}
                                        title="Switch Camera (Front/Back)"
                                        className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
                                    >
                                        <SwitchCamera className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleFlash}
                                        title="Toggle Torch/Flash"
                                        className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
                                            flashOn
                                                ? 'bg-amber-500/40 border-amber-400 text-amber-300'
                                                : 'bg-black/50 border-white/20 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Camera Viewfinder Target Frame */}
                            <div className="absolute inset-x-8 inset-y-20 border-2 border-white/30 rounded-xl pointer-events-none flex flex-col items-center justify-between p-3">
                                {/* Corner Brackets */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-sm"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-sm"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-sm"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-sm"></div>

                                <div></div>
                                <span className="text-[11px] font-medium text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-center border border-white/10 shadow-md">
                                    Position product label inside frame
                                </span>
                            </div>

                            {/* Native Mobile Camera Bottom Shutter Bar */}
                            <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent border-t border-white/10 flex items-center justify-between px-6">
                                {/* Left: Captured Counter Badge */}
                                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow">
                                    <span className="text-blue-400 font-bold">{capturedImages.length}</span> Captured
                                </div>

                                {/* Center: Prominent Native Mobile Shutter Ring Button */}
                                <button
                                    type="button"
                                    onClick={handleCaptureImage}
                                    title="Capture Photo"
                                    className="group relative flex items-center justify-center focus:outline-none"
                                >
                                    <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90 shadow-lg shadow-black/60">
                                        <div className="w-12 h-12 rounded-full bg-white group-hover:bg-slate-100 flex items-center justify-center transition-transform group-active:scale-90">
                                            <Camera className="w-6 h-6 text-slate-900" />
                                        </div>
                                    </div>
                                </button>

                                {/* Right: Upload Shortcut Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Upload Files from Device"
                                    className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90 shadow"
                                >
                                    <Upload className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Captured Images Batch Thumbnails Strip */}
            {capturedImages.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                                Product Image Batch ({capturedImages.length})
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                All images in this batch will be analyzed together.
                            </p>
                        </div>
                        {onAnalyze && (
                            <button
                                onClick={onAnalyze}
                                disabled={isAnalyzing}
                                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>Auditing Batch...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span>Analyze Product Batch ({capturedImages.length})</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Image Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {capturedImages.map((img, index) => (
                            <div
                                key={img.id}
                                className={`group relative bg-slate-900 rounded overflow-hidden border transition-all ${
                                    retakeIndex === index ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <div className="aspect-square w-full relative">
                                    <img
                                        src={img.dataUrl}
                                        alt={`Product Image ${index + 1}`}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => setPreviewImage(img)}
                                    />
                                    <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                        #{index + 1}
                                    </span>
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                        <button
                                            onClick={() => setPreviewImage(img)}
                                            title="View Image"
                                            className="p-1.5 bg-slate-800 text-white rounded hover:bg-slate-700"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => triggerRetake(index)}
                                            title="Replace Image"
                                            className="p-1.5 bg-amber-700 text-white rounded hover:bg-amber-600"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => removeImage(img.id)}
                                            title="Remove Image"
                                            className="p-1.5 bg-red-700 text-white rounded hover:bg-red-600"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    <span>Image #{index + 1}</span>
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                        title="Delete"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Image Button Card */}
                        <button
                            onClick={() => {
                                setRetakeIndex(null);
                                fileInputRef.current?.click();
                            }}
                            className="aspect-square rounded border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col items-center justify-center p-3 text-slate-600 dark:text-slate-400 transition-colors"
                        >
                            <Plus className="w-5 h-5 mb-1 text-slate-500" />
                            <span className="text-xs font-semibold">Add Image</span>
                            <span className="text-[10px] text-slate-400">Capture or Upload</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Image Zoom Preview */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Image Preview</h4>
                                <p className="text-[11px] text-slate-500 font-medium">Captured at {previewImage.timestamp}</p>
                            </div>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="p-1 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2 bg-slate-950 flex items-center justify-center max-h-[65vh]">
                            <img
                                src={previewImage.dataUrl}
                                alt="Full Preview"
                                className="max-h-[60vh] w-auto object-contain"
                            />
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[11px] text-slate-500 font-medium">ID: {previewImage.id}</span>
                            <button
                                onClick={() => {
                                    removeImage(previewImage.id);
                                    setPreviewImage(null);
                                }}
                                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-medium flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraInterface;
