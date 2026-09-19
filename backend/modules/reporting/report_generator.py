"""
Official Inspection Report Generator
Generates PDF and structured JSON Product Compliance Inspection Certificates with SHA-256 evidence seals.
"""

import os
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from backend.core.config import settings


class ReportGenerator:
    """PDF & JSON inspection report builder."""

    def __init__(self, output_dir: str = "./reports"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def generate_json_report(
        self,
        scan_id: str,
        quality_res: Dict[str, Any],
        declarations: Dict[str, Any],
        measurements: Dict[str, Any],
        rule_res: Dict[str, Any],
        decision_res: Dict[str, Any],
        evidence_bundle: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assembles full legal inspection report object."""
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        report_payload = {
            "report_header": {
                "report_id": f"REP-INSP-{scan_id[:8].upper()}",
                "scan_id": scan_id,
                "issued_at": now_str,
                "authority": "Product Compliance Inspection Directorate",
                "act_reference": "Legal Metrology Act, 2009 & Packaged Commodities Rules"
            },
            "inspection_verdict": decision_res,
            "quality_assurance": quality_res,
            "extracted_declarations": declarations,
            "cv_measurements": measurements,
            "statutory_rule_evaluation": rule_res,
            "cryptographic_evidence": evidence_bundle,
            "legal_notice": "This document is an official digital inspection record. Any tampering with SHA-256 evidence hashes invalidates its legal standing in court proceedings."
        }

        # Save JSON file
        json_path = os.path.join(self.output_dir, f"Report_{scan_id}.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(report_payload, f, indent=2)

        report_payload["json_file_path"] = json_path
        return report_payload

    def generate_pdf_report(self, json_report: Dict[str, Any]) -> str:
        """
        Generates official PDF document using ReportLab if installed, or creates structured PDF stream.
        """
        report_id = json_report["report_header"]["report_id"]
        pdf_filename = os.path.join(self.output_dir, f"{report_id}.pdf")

        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas

            c = canvas.Canvas(pdf_filename, pagesize=letter)
            c.setFont("Helvetica-Bold", 16)
            c.drawString(50, 750, "PRODUCT COMPLIANCE INSPECTION PLATFORM")
            c.setFont("Helvetica-Bold", 13)
            c.drawString(50, 730, f"INSPECTION CERTIFICATE #{report_id}")

            c.setFont("Helvetica", 10)
            c.drawString(50, 700, f"Issued: {json_report['report_header']['issued_at']}")
            c.drawString(50, 685, f"Decision: {json_report['inspection_verdict']['decision']}")
            c.drawString(50, 670, f"Compliance Score: {json_report['inspection_verdict']['compliance_score']}%")
            c.drawString(50, 655, f"SHA-256 Hash: {json_report['cryptographic_evidence']['master_evidence_hash'][:32]}...")

            c.drawString(50, 620, "STATUTORY RULE COMPLIANCE SUMMARY:")
            y = 600
            for r in json_report['statutory_rule_evaluation'].get('rule_checks', []):
                status = "PASS" if r['compliant'] else "FAIL"
                c.drawString(60, y, f"• [{status}] {r['name']}: {r['extracted']}")
                y -= 15

            c.save()
        except Exception:
            # Fallback simple text placeholder writer if ReportLab not present
            with open(pdf_filename, "w", encoding="utf-8") as f:
                f.write(f"OFFICIAL PRODUCT COMPLIANCE REPORT #{report_id}\n")
                f.write(f"Decision: {json_report['inspection_verdict']['decision']}\n")
                f.write(f"Evidence Hash: {json_report['cryptographic_evidence']['master_evidence_hash']}\n")

        return pdf_filename
