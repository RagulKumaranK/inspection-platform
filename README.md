# Product Compliance Inspection Platform

An automated, AI-assisted compliance inspection and declaration analysis system for product verification, quality assurance, and statutory declaration auditing.

## Overview

The **Product Compliance Inspection Platform** provides an end-to-end suite for scanning, extracting, verifying, and reporting product packaging declarations. It combines computer vision, optical character recognition (OCR), vision-language models (VLM), and versioned rule evaluation to ensure product labels adhere to mandatory declaration requirements.

Key features include:
- **Product Inspection & Analysis**: Automated image quality checks, blur filtering, and lighting analysis.
- **Declaration Extraction**: Dual OCR and multimodal AI parsing of package declarations (MRP, Net Quantity, Country of Origin, Manufacturer details, Batch info).
- **Physical Scale Calibration**: Computer vision calibration using ArUco reference markers to measure sub-pixel font height and text dimensions.
- **Versioned Rule Engine**: Automated evaluation of product declarations against versioned statutory compliance rule sets.
- **Evidence Verification**: Cryptographic SHA-256 evidence hashing and QR code verification for tamper-proof audit trails.
- **Report Generation**: Automated PDF/JSON inspection certificate generation with compliance scoring and violation details.

---

## Repository Structure

```
├── backend/                  # Production Backend Services (Python / FastAPI)
│   ├── main.py               # FastAPI application entrypoint
│   ├── core/                 # Settings, security, SHA-256 evidence hashing
│   ├── modules/              # Processing modules (Camera, Quality, OCR, VLM, CV, Rules, Decision, Evidence, Reports)
│   ├── database/             # SQLAlchemy async ORM models & repository
│   └── api/                  # REST API v1 pipeline endpoints
├── src/                      # Frontend Application (React + Vite)
│   ├── components/           # UI components (Scanning, Dashboard, Reports, Analytics)
│   ├── pages/                # Officer and Admin page views
│   ├── services/             # Frontend services & real backend API integration layer
│   └── data/                 # Demo datasets and mock configuration
├── docs/                     # System Architecture & Technical Specifications
└── public/                   # Static assets, PWA manifest, and icons
```

---

## Getting Started

### Frontend Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Backend Microservice Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Documentation

Detailed architecture specifications, module contracts, and integration guides are available in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

