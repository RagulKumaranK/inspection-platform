"""
Final Compliance Decision Engine
Evaluates combined scores from Image Quality, Dual OCR/VLM extraction, Font CV Measurements, and Legal Metrology Rule Engine.
Outputs tri-state decision: COMPLIANT, NON_COMPLIANT, or INDETERMINATE.
"""

from typing import Dict, Any, List
from enum import Enum


class ComplianceDecision(str, Enum):
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    INDETERMINATE = "INDETERMINATE"


class DecisionEvaluator:
    """Decision Tree & Confidence Matrix Evaluator."""

    def __init__(self, confidence_threshold: float = 0.75):
        self.confidence_threshold = confidence_threshold

    def evaluate_final_decision(
        self,
        quality_res: Dict[str, Any],
        ocr_vlm_res: Dict[str, Any],
        rule_res: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates final verdict:
        - INDETERMINATE: If image quality score < 50 or OCR confidence < threshold
        - NON_COMPLIANT: If image quality pass, but 1 or more statutory rules fail
        - COMPLIANT: If image quality pass, OCR confidence high, and all statutory rules pass
        """
        quality_score = quality_res.get("quality_score", 0.0)
        overall_quality_pass = quality_res.get("overall_pass", False)
        ocr_confidence = ocr_vlm_res.get("confidence_score", 0.0)

        rule_passed = rule_res.get("passed", False)
        violations = rule_res.get("violations", [])
        total_rules = rule_res.get("total_rules", 0)
        passed_rules = rule_res.get("passed_rules", 0)

        # 1. Indeterminate check
        if not overall_quality_pass or ocr_confidence < self.confidence_threshold:
            decision = ComplianceDecision.INDETERMINATE
            reason = f"Low image quality score ({quality_score}) or low OCR/VLM extraction confidence ({ocr_confidence}). Officer review requested."
            risk_level = "Medium"
        elif not rule_passed or len(violations) > 0:
            decision = ComplianceDecision.NON_COMPLIANT
            reason = f"Detected {len(violations)} statutory violation(s) under Legal Metrology Rules."
            risk_level = "High" if len(violations) >= 2 else "Medium"
        else:
            decision = ComplianceDecision.COMPLIANT
            reason = "Package fully satisfies all statutory Legal Metrology declaration and font size requirements."
            risk_level = "Low"

        overall_compliance_score = round((passed_rules / max(total_rules, 1)) * 100, 1) if decision != ComplianceDecision.INDETERMINATE else round(quality_score * 0.8, 1)

        return {
            "decision": decision.value,
            "compliance_score": overall_compliance_score,
            "risk_level": risk_level,
            "reason": reason,
            "quality_pass": overall_quality_pass,
            "violations_count": len(violations),
            "violations": violations,
            "requires_manual_inspection": decision == ComplianceDecision.INDETERMINATE
        }
