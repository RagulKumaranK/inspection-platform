"""
Multiple Image Handling & Session Manager
Aggregates front, back, side, top, bottom package label surfaces into a single unified scan bundle.
"""

from typing import List, Dict, Any, Optional
import hashlib


class MultiImageManager:
    """Manages multi-angle package captures, panel association, and session completeness."""

    REQUIRED_PANELS = ["front", "back"]
    OPTIONAL_PANELS = ["top", "bottom", "side_left", "side_right"]

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.images: Dict[str, Dict[str, Any]] = {}

    def add_panel_image(self, panel_type: str, image_bgr_or_base64: Any, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Registers an image panel to the active session."""
        panel_key = panel_type.lower()
        image_hash = hashlib.sha256(str(image_bgr_or_base64).encode('utf-8')).hexdigest()[:16]

        record = {
            "panel": panel_key,
            "hash": image_hash,
            "metadata": metadata or {},
            "data": image_bgr_or_base64
        }
        self.images[panel_key] = record
        return record

    def check_session_completeness(self) -> Dict[str, Any]:
        """Evaluates whether all mandatory package panels have been provided."""
        captured_panels = list(self.images.keys())
        missing_required = [p for p in self.REQUIRED_PANELS if p not in captured_panels]
        is_complete = len(missing_required) == 0

        return {
            "session_id": self.session_id,
            "is_complete": is_complete,
            "captured_panels": captured_panels,
            "missing_required_panels": missing_required,
            "total_images": len(self.images),
            "coverage_percentage": round((len(captured_panels) / (len(self.REQUIRED_PANELS) + len(self.OPTIONAL_PANELS))) * 100, 1)
        }

    def get_all_panel_hashes(self) -> List[str]:
        """Returns ordered list of all panel image hashes."""
        return [record["hash"] for record in self.images.values()]
