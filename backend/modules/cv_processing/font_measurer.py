"""
Sub-Pixel Declaration Font Size & Dimension Measurer
Converts OCR text bounding boxes and contour height metrics into physical millimeters using ArUco calibration matrix.
"""

import cv2
import numpy as np
from typing import Dict, Any, List


class FontMeasurer:
    """Computer vision font height & declaration area measurement engine."""

    def __init__(self, mm_per_pixel: float):
        self.mm_per_pixel = mm_per_pixel

    def measure_text_bounding_box(self, bbox_px: Dict[str, int]) -> Dict[str, Any]:
        """Converts pixel bounding box (height/width) to physical millimeter dimensions."""
        px_height = bbox_px.get("height", 0)
        px_width = bbox_px.get("width", 0)

        mm_height = round(px_height * self.mm_per_pixel, 2)
        mm_width = round(px_width * self.mm_per_pixel, 2)

        # Capital 'X-height' estimation (~70% of total line box height)
        x_height_mm = round(mm_height * 0.72, 2)

        return {
            "px_height": px_height,
            "px_width": px_width,
            "mm_height": mm_height,
            "mm_width": mm_width,
            "font_x_height_mm": x_height_mm,
            "scale_mm_per_px": self.mm_per_pixel
        }

    def measure_all_declarations(self, ocr_lines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Processes all OCR bounding boxes and attaches millimeter metrics."""
        measured_results = []
        for line in ocr_lines:
            bbox = line.get("bbox", {})
            meas = self.measure_text_bounding_box(bbox)
            measured_results.append({
                "text": line.get("text", ""),
                "confidence": line.get("confidence", 0.0),
                "measurement": meas
            })
        return measured_results
