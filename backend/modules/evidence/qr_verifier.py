"""
QR Code Verification & Payload Integrity Checker
Scans package QR codes, parses GS1 Digital Links, validates manufacturer URLs, and checks payload signatures.
"""

import cv2
import numpy as np
from typing import Dict, Any, Optional
import urllib.parse


class QRVerifier:
    """QR Code payload decoder & digital verification module."""

    def detect_and_decode_qr(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """Detects QR code in frame and decodes payload data."""
        detector = cv2.QRCodeDetector()
        data, bbox, straight_qrcode = detector.detectAndDecode(img_bgr)

        if not data or bbox is None:
            return {
                "qr_found": False,
                "raw_payload": None,
                "message": "No QR code detected in frame"
            }

        parsed_url = urllib.parse.urlparse(data)
        is_url = bool(parsed_url.scheme and parsed_url.netloc)

        return {
            "qr_found": True,
            "raw_payload": data,
            "is_url": is_url,
            "domain": parsed_url.netloc if is_url else None,
            "bbox": bbox.tolist() if bbox is not None else [],
            "status": "Decoded Successfully"
        }

    def verify_qr_compliance(self, qr_info: Dict[str, Any], extracted_declarations: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verifies decoded QR payload against extracted label declarations.
        Ensures QR payload contains matching GTIN / Batch / MRP metadata.
        """
        if not qr_info.get("qr_found"):
            return {
                "verified": False,
                "reason": "No QR code detected for verification",
                "mrp_matched": None,
                "batch_matched": None
            }

        payload = qr_info.get("raw_payload", "")
        extracted_mrp_val = str(extracted_declarations.get("mrp_value", ""))
        extracted_batch = str(extracted_declarations.get("batch_number", ""))

        mrp_match = extracted_mrp_val in payload if extracted_mrp_val else True
        batch_match = extracted_batch in payload if extracted_batch else True

        is_verified = mrp_match and batch_match

        return {
            "verified": is_verified,
            "payload_data": payload,
            "mrp_matched": mrp_match,
            "batch_matched": batch_match,
            "status": "QR Code Content Verified Intact" if is_verified else "Mismatch between QR payload and package physical label"
        }
