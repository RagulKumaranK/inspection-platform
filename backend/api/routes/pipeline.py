"""
FastAPI V1 Pipeline API Router
REST API endpoints exposing camera ingest, quality check, dual OCR/VLM extraction, CV measurement, rule engine, QR verifier, SHA-256 evidence hashing, and report generator.
"""

import uuid
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks, Body
from pydantic import BaseModel, Field

from backend.modules.camera.stream_handler import CameraStreamHandler
from backend.modules.camera.multi_image_manager import MultiImageManager
from backend.modules.quality.image_quality_checker import ImageQualityChecker
from backend.modules.ocr.ocr_engine import OCREngine
from backend.modules.vlm.vlm_extractor import VLMExtractor
from backend.modules.cv_processing.aruco_calibrator import ArUcoCalibrator
from backend.modules.cv_processing.font_measurer import FontMeasurer
from backend.modules.rule_engine.engine import RuleEngineDispatcher
from backend.modules.decision.decision_evaluator import DecisionEvaluator
from backend.modules.evidence.sha256_hasher import SHA256EvidenceHasher
from backend.modules.evidence.qr_verifier import QRVerifier
from backend.modules.reporting.report_generator import ReportGenerator

router = APIRouter(prefix="/pipeline", tags=["Inspection Pipeline"])


class ImageScanPayload(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded JPEG/PNG frame")
    panel_type: str = Field("front", description="Package side (front, back, side, top, bottom)")
    officer_id: str = Field("OFFICER-2026", description="Active inspecting officer ID")
    rule_version: str = Field("2024.1", description="Statutory rule engine version (2011, 2022, 2024.1)")
    session_id: Optional[str] = Field(None, description="Multi-angle session identifier")


@router.post("/evaluate-image-quality")
async def evaluate_image_quality(payload: ImageScanPayload) -> Dict[str, Any]:
    """Endpoint: Evaluates image blur, lighting illumination, glare, and resolution."""
    handler = CameraStreamHandler()
    img_bgr = handler.decode_base64_image(payload.image_base64)

    res_check = handler.validate_resolution(img_bgr)
    quality_checker = ImageQualityChecker()
    quality_res = quality_checker.evaluate_image_quality(img_bgr)

    return {
        "resolution": res_check,
        "quality_metrics": quality_res
    }


@router.post("/calibrate-and-measure")
async def calibrate_and_measure(payload: ImageScanPayload) -> Dict[str, Any]:
    """Endpoint: ArUco marker detection & font height measurement in mm."""
    handler = CameraStreamHandler()
    img_bgr = handler.decode_base64_image(payload.image_base64)

    calibrator = ArUcoCalibrator()
    calib_res = calibrator.detect_marker_and_calibrate(img_bgr)

    ocr = OCREngine()
    ocr_res = ocr.extract_text_with_boxes(img_bgr)

    measurer = FontMeasurer(mm_per_pixel=calib_res["mm_per_pixel"])
    font_measurements = measurer.measure_all_declarations(ocr_res["lines"])

    return {
        "calibration": calib_res,
        "ocr_lines_count": len(ocr_res["lines"]),
        "measurements": font_measurements
    }


@router.post("/process-full-scan")
async def process_full_scan(payload: ImageScanPayload) -> Dict[str, Any]:
    """
    Endpoint: Runs complete end-to-end production analysis pipeline across all 15 modules.
    Returns complete inspection certificate, evidence hashes, and legal decision.
    """
    scan_id = f"SCAN-{uuid.uuid4().hex[:10].upper()}"

    # 1. Camera Frame Ingestion & Resolution Check
    handler = CameraStreamHandler()
    img_bgr = handler.decode_base64_image(payload.image_base64)
    res_check = handler.validate_resolution(img_bgr)

    # 2. Image Quality Control
    quality_checker = ImageQualityChecker()
    quality_res = quality_checker.evaluate_image_quality(img_bgr)

    # 3. ArUco CV Calibration & Font Measurement
    calibrator = ArUcoCalibrator()
    calib_res = calibrator.detect_marker_and_calibrate(img_bgr)

    ocr = OCREngine()
    ocr_res = ocr.extract_text_with_boxes(img_bgr)

    measurer = FontMeasurer(mm_per_pixel=calib_res["mm_per_pixel"])
    font_measurements = measurer.measure_all_declarations(ocr_res["lines"])

    # 4. Multimodal VLM Structured Extraction
    vlm = VLMExtractor()
    vlm_res = vlm.extract_declarations_from_image(img_bgr, ocr_text_hint=ocr_res["raw_text"])
    declarations = vlm_res["extracted_declarations"]

    # 5. Versioned Legal Metrology Rule Engine Evaluation
    dispatcher = RuleEngineDispatcher(version=payload.rule_version)
    rule_res = dispatcher.evaluate_compliance(declarations, font_measurements)

    # 6. Tri-State Decision Engine
    decision_evaluator = DecisionEvaluator()
    decision_res = decision_evaluator.evaluate_final_decision(quality_res, vlm_res, rule_res)

    # 7. QR Payload Verification
    qr = QRVerifier()
    qr_info = qr.detect_and_decode_qr(img_bgr)
    qr_verif = qr.verify_qr_compliance(qr_info, declarations)

    # 8. Cryptographic SHA-256 Evidence Hashing
    image_hash = SHA256EvidenceHasher.generate_image_sha256(payload.image_base64)
    evidence_bundle = SHA256EvidenceHasher.generate_inspection_evidence_bundle(
        scan_id=scan_id,
        image_hashes=[image_hash],
        declarations=declarations,
        decision=decision_res
    )

    # 9. Inspection Report Generation
    reporter = ReportGenerator()
    json_report = reporter.generate_json_report(
        scan_id=scan_id,
        quality_res=quality_res,
        declarations=declarations,
        measurements={"calibration": calib_res, "items": font_measurements},
        rule_res=rule_res,
        decision_res=decision_res,
        evidence_bundle=evidence_bundle
    )

    return {
        "status": "SUCCESS",
        "scan_id": scan_id,
        "officer_id": payload.officer_id,
        "resolution": res_check,
        "quality": quality_res,
        "calibration": calib_res,
        "extracted_declarations": declarations,
        "font_measurements": font_measurements,
        "rule_engine_verdict": rule_res,
        "decision": decision_res,
        "qr_verification": qr_verif,
        "cryptographic_evidence": evidence_bundle,
        "report": json_report
    }
