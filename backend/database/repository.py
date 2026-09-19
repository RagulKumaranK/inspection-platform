"""
Async Database Repository
Provides CRUD operations for inspection scans, evidence records, and compliance reports.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from backend.core.config import settings
from backend.database.models import Base, InspectionScanModel, PackageImageModel, ExtractedDeclarationModel, ComplianceViolationModel


class ComplianceRepository:
    """Repository handling async database operations."""

    def __init__(self, db_url: str = None):
        self.db_url = db_url or settings.DATABASE_URL
        self.engine = create_async_engine(self.db_url, echo=False)
        self.async_session = async_sessionmaker(self.engine, expire_on_commit=False, class_=AsyncSession)

    async def init_db(self):
        """Creates tables if not existing."""
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def save_inspection_scan(
        self,
        scan_id: str,
        officer_id: str,
        product_name: str,
        decision_res: Dict[str, Any],
        quality_res: Dict[str, Any],
        evidence_bundle: Dict[str, Any],
        declarations: Dict[str, Any],
        violations: List[str]
    ) -> InspectionScanModel:
        """Saves completed scan inspection entity with child relationships."""
        async with self.async_session() as session:
            async with session.begin():
                scan = InspectionScanModel(
                    id=scan_id,
                    officer_id=officer_id,
                    product_name=product_name,
                    decision=decision_res.get("decision", "INDETERMINATE"),
                    compliance_score=decision_res.get("compliance_score", 0.0),
                    risk_level=decision_res.get("risk_level", "Medium"),
                    quality_score=quality_res.get("quality_score", 0.0),
                    quality_passed=quality_res.get("overall_pass", False),
                    master_evidence_hash=evidence_bundle.get("master_evidence_hash", "HASH_SIMULATED"),
                    hmac_signature=evidence_bundle.get("cryptographic_signature", "SIG_SIMULATED")
                )
                session.add(scan)

                # Add declarations
                for k, v in declarations.items():
                    decl = ExtractedDeclarationModel(
                        scan_id=scan_id,
                        field_name=k,
                        extracted_text=str(v),
                        confidence=0.98,
                        is_compliant=True
                    )
                    session.add(decl)

                # Add violations
                for viol in violations:
                    viol_record = ComplianceViolationModel(
                        scan_id=scan_id,
                        rule_id="RULE_STATUTORY_BREACH",
                        statute_reference="Legal Metrology Act, 2009",
                        violation_type="Mandatory Declaration Missing/Non-compliant",
                        details=viol,
                        severity="High"
                    )
                    session.add(viol_record)

            return scan
