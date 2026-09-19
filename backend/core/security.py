"""
Cryptographic Security & Evidence Verification Utilities
SHA-256 payload hashing, image payload hashing, EXIF signature integrity checking
"""

import hashlib
import hmac
import json
import base64
from typing import Dict, Any, Union
from backend.core.config import settings


def generate_sha256_hash(data: Union[str, bytes]) -> str:
    """Generate SHA-256 hex digest for given text or byte stream."""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()


def compute_evidence_hash(
    raw_images_hashes: list[str],
    extracted_declarations: Dict[str, Any],
    measurement_results: Dict[str, Any],
    timestamp_iso: str
) -> str:
    """
    Computes immutable evidence chain SHA-256 hash across all inspection inputs.
    Any tampering with captured images or extracted fields invalidates this hash.
    """
    payload = {
        "images": sorted(raw_images_hashes),
        "declarations": extracted_declarations,
        "measurements": measurement_results,
        "timestamp": timestamp_iso,
        "salt": settings.EVIDENCE_SALT
    }
    serialized_payload = json.dumps(payload, sort_keys=True)
    return generate_sha256_hash(serialized_payload)


def sign_payload_hmac(payload_hash: str) -> str:
    """Generates HMAC-SHA256 signature using engine key."""
    key_bytes = settings.SECRET_KEY.encode('utf-8')
    data_bytes = payload_hash.encode('utf-8')
    signature = hmac.new(key_bytes, data_bytes, hashlib.sha256).digest()
    return base64.b64encode(signature).decode('utf-8')


def verify_payload_hmac(payload_hash: str, signature_b64: str) -> bool:
    """Verifies HMAC signature for tamper check."""
    expected_sig = sign_payload_hmac(payload_hash)
    return hmac.compare_digest(expected_sig, signature_b64)
