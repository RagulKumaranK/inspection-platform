"""
SQLAlchemy Async ORM Database Models
Database persistence for inspection scans, multi-angle images, extracted declarations, measurements, violations, and cryptographic audit logs.
"""

from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, Integer, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class InspectionScanModel(Base):
    __tablename__ = "inspection_scans"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    officer_id: Mapped[str] = mapped_column(String(64), default="OFFICER-001")
    barcode: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    product_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    
    # Decision metrics
    decision: Mapped[str] = mapped_column(String(32), default="INDETERMINATE")  # COMPLIANT, NON_COMPLIANT, INDETERMINATE
    compliance_score: Mapped[float] = mapped_column(Float, default=0.0)
    risk_level: Mapped[str] = mapped_column(String(32), default="Medium")
    rule_version: Mapped[str] = mapped_column(String(32), default="2024.1")

    # Quality metrics
    quality_score: Mapped[float] = mapped_column(Float, default=0.0)
    quality_passed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Cryptographic hashes
    master_evidence_hash: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    hmac_signature: Mapped[str] = mapped_column(String(256))

    # Relationships
    images: Mapped[List["PackageImageModel"]] = relationship(back_populates="scan", cascade="all, delete-orphan")
    declarations: Mapped[List["ExtractedDeclarationModel"]] = relationship(back_populates="scan", cascade="all, delete-orphan")
    violations: Mapped[List["ComplianceViolationModel"]] = relationship(back_populates="scan", cascade="all, delete-orphan")


class PackageImageModel(Base):
    __tablename__ = "package_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scan_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspection_scans.id"))
    panel_type: Mapped[str] = mapped_column(String(32))  # front, back, side, top, bottom
    sha256_hash: Mapped[str] = mapped_column(String(64))
    storage_path_or_url: Mapped[str] = mapped_column(Text)
    width: Mapped[int] = mapped_column(Integer)
    height: Mapped[int] = mapped_column(Integer)

    scan: Mapped["InspectionScanModel"] = relationship(back_populates="images")


class ExtractedDeclarationModel(Base):
    __tablename__ = "extracted_declarations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scan_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspection_scans.id"))
    field_name: Mapped[str] = mapped_column(String(64))
    extracted_text: Mapped[str] = mapped_column(Text)
    measured_font_height_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    required_font_height_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    is_compliant: Mapped[bool] = mapped_column(Boolean, default=True)

    scan: Mapped["InspectionScanModel"] = relationship(back_populates="declarations")


class ComplianceViolationModel(Base):
    __tablename__ = "compliance_violations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scan_id: Mapped[str] = mapped_column(String(64), ForeignKey("inspection_scans.id"))
    rule_id: Mapped[str] = mapped_column(String(64))
    statute_reference: Mapped[str] = mapped_column(String(128))
    violation_type: Mapped[str] = mapped_column(String(128))
    details: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(32), default="High")

    scan: Mapped["InspectionScanModel"] = relationship(back_populates="violations")
