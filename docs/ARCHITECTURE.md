# Product Compliance Inspection Platform - System Architecture

This repository contains the complete codebase for the **Product Compliance Inspection Platform**, designed to verify packaged commodities and product declarations against statutory compliance provisions.

---

## 1. Dual Architecture Model: Demo vs Production Real Engine

To ensure seamless live demonstrations and robust system evaluation while maintaining a genuine production-ready codebase, the system employs a dual-architecture design:

```
+-----------------------------------------------------------------------------------+
|                                 FRONTEND APP                                     |
+-----------------------------------------------------------------------------------+
       |                                                               |
       | (Default Active Mode)                                         | (Configured via VITE_USE_MOCK_DATA=false)
       v                                                               v
+------------------------------------+               +------------------------------------+
|         DEMO PIPELINE              |               |      REAL PRODUCTION PIPELINE      |
|  - Fixed Product Datasets          |               |  - src/services/real/*             |
|  - mock87Reports.js                |               |  - backend/                        |
|  - Deterministic processing states |               |  - Real Camera, Quality Control,   |
|  - Instant predictable demo        |               |    ArUco CV, Dual OCR/VLM, SHA-256  |
+------------------------------------+               +------------------------------------+
```

- **Demo Pipeline (Currently Active)**: Uses pre-configured fixed product datasets (`Choco-filled Wafer Stick` & `Sunscreen Spf 50`) to guarantee deterministic UI performance, fast response times, and 100% reliable live demonstrations.
- **Real Production Architecture (Structure Only)**: Complete Python FastAPI microservice architecture (`backend/`) and matching client service abstractions (`src/services/real/`) implementing all 15 core processing modules.

---

## 2. Real Implementation Pipeline Modules (15 Architecture Pillars)

### 1. Camera Image Capture
- **Frontend**: [RealCameraCaptureService.js](../src/services/real/RealCameraCaptureService.js)
- **Backend**: [stream_handler.py](../backend/modules/camera/stream_handler.py)
- WebRTC 1080p video stream ingestion, continuous focus control, frame extraction, resolution validation (Min 1280x720).

### 2. Multiple Image Handling
- **Frontend**: [RealMultiImageManager.js](../src/services/real/RealMultiImageManager.js)
- **Backend**: [multi_image_manager.py](../backend/modules/camera/multi_image_manager.py)
- Multi-angle package panel aggregator (Front, Back, Side, Top, Bottom) tracking package surface area completeness.

### 3. Image Quality Checking
- **Frontend**: [RealQualityCheckerService.js](../src/services/real/RealQualityCheckerService.js)
- **Backend**: [image_quality_checker.py](../backend/modules/quality/image_quality_checker.py)
- Variance of Laplacian blur detection, HSV brightness histogram checking, specular glare detection.

### 4. Optical Character Recognition (OCR)
- **Frontend**: [RealOCRService.js](../src/services/real/RealOCRService.js)
- **Backend**: [ocr_engine.py](../backend/modules/ocr/ocr_engine.py)
- Dual Tesseract / PaddleOCR engine with adaptive thresholding, sub-pixel text bounding boxes, and line-by-line confidence scoring.

### 5. VLM-Based Extraction
- **Frontend**: [RealVLMExtractionService.js](../src/services/real/RealVLMExtractionService.js)
- **Backend**: [vlm_extractor.py](../backend/modules/vlm/vlm_extractor.py)
- Multimodal Vision Language Model adapter (Qwen2-VL / Llama-3.2-Vision / Gemini API) parsing 8 mandatory packaged commodity fields into strict JSON schema.

### 6. Computer Vision Processing
- **Backend**: [font_measurer.py](../backend/modules/cv_processing/font_measurer.py)
- Image deskewing, binarization, bounding box height extraction, and contour aspect ratio analysis.

### 7. ArUco-Based Pixel-to-mm Measurement
- **Frontend**: [RealCVMeasurementService.js](../src/services/real/RealCVMeasurementService.js)
- **Backend**: [aruco_calibrator.py](../backend/modules/cv_processing/aruco_calibrator.py)
- ArUco reference marker detection (`DICT_4X4_50`), pose estimation, calibration matrix calculation ($mm/px$), font height measurement in millimeters.

### 8. Structured JSON Extraction
- **Backend**: [vlm_extractor.py](../backend/modules/vlm/vlm_extractor.py)
- Pydantic schema validation enforcing type safety on extracted fields (MRP, Net Qty, USP, Mfg Date, Country of Origin, Manufacturer Address, Consumer Care).

### 9. Evidence Verification
- **Frontend**: [RealEvidenceVerificationService.js](../src/services/real/RealEvidenceVerificationService.js)
- **Backend**: [security.py](../backend/core/security.py)
- Cryptographic payload signature verification and EXIF integrity check.

### 10. Versioned Statutory Compliance Rule Engine
- **Frontend**: [RealRuleEngineService.js](../src/services/real/RealRuleEngineService.js)
- **Backend**: [engine.py](../backend/modules/rule_engine/engine.py)
- Statutory rule sets for PCR 2011, 2022 amendments, and 2024 amendments (Font size tables, USP requirements, dual units, consumer helpline mandatory fields).

### 11. Compliant / Non-Compliant / Indeterminate Decision
- **Frontend**: [RealDecisionEngineService.js](../src/services/real/RealDecisionEngineService.js)
- **Backend**: [decision_evaluator.py](../backend/modules/decision/decision_evaluator.py)
- Tri-state Decision Tree resolving results based on quality score, OCR/VLM confidence threshold, and rule violation severities.

### 12. Report Generation
- **Frontend**: [RealReportGeneratorService.js](../src/services/real/RealReportGeneratorService.js)
- **Backend**: [report_generator.py](../backend/modules/reporting/report_generator.py)
- Automated PDF & JSON Inspection Report Certificate builder with embedded cryptographic hashes and legal notice clauses.

### 13. QR Verification
- **Frontend**: [RealQRVerificationService.js](../src/services/real/RealQRVerificationService.js)
- **Backend**: [qr_verifier.py](../backend/modules/evidence/qr_verifier.py)
- QR code payload parsing, GS1 Digital Link decoder, signature matching against physical label text.

### 14. SHA-256 Evidence Hashing
- **Frontend**: [RealEvidenceVerificationService.js](../src/services/real/RealEvidenceVerificationService.js)
- **Backend**: [sha256_hasher.py](../backend/modules/evidence/sha256_hasher.py)
- SHA-256 hash chains across raw images, OCR extracts, and decisions with HMAC signatures for legal evidence admissibility in court.

### 15. Database / API Integration
- **Frontend**: [RealDatabaseService.js](../src/services/real/RealDatabaseService.js)
- **Backend**: [repository.py](../backend/database/repository.py)
- Async SQLAlchemy ORM models (`InspectionScanModel`, `PackageImageModel`, `ExtractedDeclarationModel`, `ComplianceViolationModel`) & REST API routes (`/api/v1/pipeline/*`).

---

## 3. Switching from Demo Mode to Production Real Pipeline

To connect the real implementation pipeline in production when the backend FastAPI server is running:

1. Update `.env`:
   ```env
   VITE_USE_MOCK_DATA=false
   VITE_REAL_BACKEND_URL=http://localhost:8000/api/v1
   ```
2. Start Python backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn backend.main:app --port 8000 --reload
   ```
3. The frontend real services will stream camera frames to the `/api/v1/pipeline/process-full-scan` endpoint and display real-time AI compliance evaluations.
