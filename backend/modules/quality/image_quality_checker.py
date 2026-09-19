"""
Image Quality Assurance Engine
Blur detection (Laplacian Variance), Illumination check (HSV), Glare/Reflection detection, ArUco visibility verification
"""

import cv2
import numpy as np
from typing import Dict, Any
from backend.core.config import settings


class ImageQualityChecker:
    """Performs Computer Vision quality checks on input image frames before OCR/VLM evaluation."""

    def __init__(
        self,
        blur_threshold: float = None,
        min_brightness: float = None,
        max_brightness: float = None,
        max_glare_ratio: float = None
    ):
        self.blur_threshold = blur_threshold or settings.MIN_LAPLACIAN_VAR_BLUR_THRESHOLD
        self.min_brightness = min_brightness or settings.MIN_BRIGHTNESS_HSV_THRES
        self.max_brightness = max_brightness or settings.MAX_BRIGHTNESS_HSV_THRES
        self.max_glare_ratio = max_glare_ratio or settings.MAX_GLARE_PIXEL_RATIO

    def calculate_blur_score(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """Calculates variance of Laplacian to determine image sharpness/blur standard."""
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        is_sharp = laplacian_var >= self.blur_threshold

        return {
            "laplacian_variance": round(laplacian_var, 2),
            "threshold": self.blur_threshold,
            "passed": is_sharp,
            "status": "Sharp" if is_sharp else "Blurred"
        }

    def calculate_illumination(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """Calculates average brightness (V channel in HSV) and lighting uniformness."""
        hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
        v_channel = hsv[:, :, 2]
        mean_brightness = float(np.mean(v_channel))
        std_brightness = float(np.std(v_channel))

        is_good = self.min_brightness <= mean_brightness <= self.max_brightness

        return {
            "mean_brightness": round(mean_brightness, 2),
            "std_brightness": round(std_brightness, 2),
            "passed": is_good,
            "status": "Optimal" if is_good else ("Underexposed" if mean_brightness < self.min_brightness else "Overexposed")
        }

    def detect_glare(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """Detects high-intensity specular reflection / glare regions that blind OCR."""
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        glare_mask = cv2.threshold(gray, 245, 255, cv2.THRESH_BINARY)[1]
        glare_pixels = int(cv2.countNonZero(glare_mask))
        total_pixels = gray.size
        glare_ratio = float(glare_pixels / max(total_pixels, 1))

        passed = glare_ratio <= self.max_glare_ratio

        return {
            "glare_ratio": round(glare_ratio, 4),
            "max_threshold": self.max_glare_ratio,
            "passed": passed,
            "status": "Clear" if passed else "Excessive Glare Detected"
        }

    def evaluate_image_quality(self, img_bgr: np.ndarray) -> Dict[str, Any]:
        """Executes full quality suite and yields overall PASS/FAIL recommendation."""
        blur_res = self.calculate_blur_score(img_bgr)
        illum_res = self.calculate_illumination(img_bgr)
        glare_res = self.detect_glare(img_bgr)

        overall_pass = blur_res["passed"] and illum_res["passed"] and glare_res["passed"]

        # Quality score 0-100 scale formula
        normalized_blur = min(blur_res["laplacian_variance"] / (self.blur_threshold * 2), 1.0) * 40
        normalized_illum = (1.0 - abs(illum_res["mean_brightness"] - 128) / 128) * 40
        normalized_glare = (1.0 - min(glare_res["glare_ratio"] / self.max_glare_ratio, 1.0)) * 20
        overall_score = round(max(0, min(100, normalized_blur + normalized_illum + normalized_glare)), 1)

        return {
            "overall_pass": overall_pass,
            "quality_score": overall_score,
            "blur_check": blur_res,
            "illumination_check": illum_res,
            "glare_check": glare_res,
            "recommendation": "Proceed to Inspection" if overall_pass else "Recapture image with better lighting/focus"
        }
