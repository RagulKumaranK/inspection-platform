# Product Compliance Inspection Engine - Backend Architecture

Production-ready microservice architecture for automated product inspection, declaration analysis, and statutory rule verification.

## Pipeline Architecture

```
                                  +------------------------------------+
                                  |     Camera Frame Capture Stream    |
                                  +------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |     Image Quality Assurance Engine  |
                                  |  (Blur / Illumination / Glare CV)  |
                                  +------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |  ArUco Marker Scale Calibration   |
                                  |   (DICT_4X4_50 / Pixel to mm scale)|
                                  +------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |     Dual OCR + VLM Extractor       |
                                  | (Tesseract / Paddle + Qwen2-VL)    |
                                  +------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |  Versioned Rule Engine (2011/22/24)|
                                  | (Mandatory 8 Fields & Font Sizes)  |
                                  +------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |  SHA-256 Cryptographic Evidence    |
                                  |   & HMAC Audit Trail Generator     |
                                  +------------------------------------+
                                                    |
                                                    v
                                  +------------------------------------+
                                  |  Tri-State Decision & PDF Reports  |
                                  | (COMPLIANT/NON_COMPLIANT/INDET.)   |
                                  +------------------------------------+
```

## Quick Start Guide

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Launch FastAPI Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI Documentation: `http://localhost:8000/docs`

## Core Modules & References

1. **Camera Ingest (`backend/modules/camera/stream_handler.py`)**: High-resolution WebRTC stream handler and aspect ratio normalization.
2. **Multi-Image Manager (`backend/modules/camera/multi_image_manager.py`)**: Multi-angle session aggregator for front, back, top, bottom, and side panels.
3. **Quality Assurance (`backend/modules/quality/image_quality_checker.py`)**: Laplacian variance blur filter, HSV brightness histogram validator, and glare detector.
4. **Dual OCR (`backend/modules/ocr/ocr_engine.py`)**: Sub-pixel bounding box localization and character confidence scoring.
5. **Multimodal VLM (`backend/modules/vlm/vlm_extractor.py`)**: Structured JSON schema extraction of mandatory packaged commodity declarations.
6. **ArUco Calibration (`backend/modules/cv_processing/aruco_calibrator.py`)**: ArUco marker pose detection and physical millimeter scaling matrix.
7. **Font Measurer (`backend/modules/cv_processing/font_measurer.py`)**: Converts OCR text bounding boxes to physical millimeter heights.
8. **Versioned Rule Engine (`backend/modules/rule_engine/engine.py`)**: Enforces statutory rules for 2011, 2022, and 2024 PCR amendments.
9. **Tri-State Decision Engine (`backend/modules/decision/decision_evaluator.py`)**: Resolves verdicts into `COMPLIANT`, `NON_COMPLIANT`, or `INDETERMINATE`.
10. **Evidence Hasher (`backend/modules/evidence/sha256_hasher.py`)**: Computes immutable SHA-256 hash chains for legal admissibility.
11. **QR Verifier (`backend/modules/evidence/qr_verifier.py`)**: Scans & verifies QR code payloads against physical packaging.
12. **Report Generator (`backend/modules/reporting/report_generator.py`)**: Automated PDF and JSON inspection report builder.
13. **Async Database Repository (`backend/database/repository.py`)**: SQLAlchemy async ORM storage for inspection audits.
