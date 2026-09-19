"""
Core Application Configuration
Legal Metrology Compliance Engine Real Architecture
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Dict, Any


class Settings(BaseSettings):
    APP_NAME: str = "Legal Metrology AI Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "PRODUCTION_COMPLIANCE_KEY_2026_LEGAL_METROLOGY_SECRET"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "https://*.vercel.app"]

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./legal_metrology.db"

    # Image Processing Defaults
    MIN_IMAGE_RESOLUTION_WIDTH: int = 1280
    MIN_IMAGE_RESOLUTION_HEIGHT: int = 720
    MIN_LAPLACIAN_VAR_BLUR_THRESHOLD: float = 100.0
    MIN_BRIGHTNESS_HSV_THRES: float = 40.0
    MAX_BRIGHTNESS_HSV_THRES: float = 230.0
    MAX_GLARE_PIXEL_RATIO: float = 0.15

    # ArUco Marker Calibration Specs
    ARUCO_DICTIONARY_TYPE: str = "DICT_4X4_50"
    ARUCO_MARKER_SIZE_MM: float = 20.0  # standard 20mm x 20mm physical marker size

    # Legal Metrology Engine Versioning
    ACTIVE_RULE_VERSION: str = "2024.1"
    SUPPORTED_RULE_VERSIONS: List[str] = ["2011", "2022", "2024.1"]

    # Vision Language Model API Specs
    VLM_PROVIDER: str = "qwen2_vl"  # qwen2_vl | llama_3_2_vision | gemini_vlm
    VLM_API_ENDPOINT: Optional[str] = "https://api.vlm.internal/v1/extract"
    VLM_API_KEY: Optional[str] = os.getenv("VLM_API_KEY", "")

    # OCR Config
    OCR_ENGINE: str = "tesseract_paddle_dual"
    TESSERACT_CMD_PATH: Optional[str] = None

    # Cryptographic Hash Salt
    EVIDENCE_SALT: str = "LEGAL_METROLOGY_SHA256_EVIDENCE_SALT_INDIA_2026"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
