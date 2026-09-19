"""
Camera Image Capture & Stream Handler
Real-time frame ingestion, image normalization, resolution validation, WebRTC/RTSP stream adapter
"""

import base64
import io
import numpy as np
from PIL import Image
from typing import Dict, Any, Tuple
from backend.core.config import settings


class CameraStreamHandler:
    """Handles raw camera frame ingestion, resolution checks, and image decoding."""

    def __init__(self, min_width: int = None, min_height: int = None):
        self.min_width = min_width or settings.MIN_IMAGE_RESOLUTION_WIDTH
        self.min_height = min_height or settings.MIN_IMAGE_RESOLUTION_HEIGHT

    def decode_base64_image(self, base64_str: str) -> np.ndarray:
        """Decodes base64 string or data URL to OpenCV BGR numpy array."""
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        
        image_bytes = base64.b64decode(base64_str)
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(pil_img)
        # Convert RGB to BGR for OpenCV
        img_bgr = img_np[:, :, ::-1].copy()
        return img_bgr

    def validate_resolution(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """Validates that captured image meets Legal Metrology inspection quality specs."""
        height, width = img_bgr.shape[:2]
        is_valid = width >= self.min_width and height >= self.min_height

        return {
            "valid": is_valid,
            "width": width,
            "height": height,
            "required_width": self.min_width,
            "required_height": self.min_height,
            "aspect_ratio": round(width / max(height, 1), 3),
            "message": "Resolution compliant" if is_valid else f"Resolution {width}x{height} below minimum {self.min_width}x{self.min_height}"
        }

    def process_captured_frame(self, frame_data_url: str) -> Dict[str, Any]:
        """Full pipeline step for converting frame data URL to normalized image matrix and validation result."""
        img_bgr = self.decode_base64_image(frame_data_url)
        res_check = self.validate_resolution(img_bgr)
        return {
            "image": img_bgr,
            "resolution_check": res_check,
            "shape": img_bgr.shape
        }
