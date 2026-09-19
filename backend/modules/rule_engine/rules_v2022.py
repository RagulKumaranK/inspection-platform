"""
Legal Metrology (Packaged Commodities) Amendment Rules, 2022
Includes mandatory Unit Sale Price (USP) and Country of Origin declarations.
"""

from typing import Dict, Any, List
from backend.modules.rule_engine.rules_v2011 import LegalMetrologyRules2011


class LegalMetrologyRules2022(LegalMetrologyRules2011):
    """Implementation of Legal Metrology 2022 Amendment Rules."""

    VERSION = "2022"

    @classmethod
    def evaluate_rules(cls, declarations: Dict[str, Any], measurements: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extends 2011 rules with mandatory Unit Sale Price and Country of Origin enforcement."""
        base_res = super().evaluate_rules(declarations, measurements)
        rule_checks = list(base_res["rule_checks"])
        violations = list(base_res["violations"])

        # 6. Unit Sale Price (USP) Rule (Mandatory w.e.f. Dec 2022)
        usp = declarations.get("unit_sale_price")
        rule_checks.append({
            "rule_id": "RULE_6_1_11_2022",
            "name": "Unit Sale Price (USP)",
            "statute": "Rule 6(11) PCR Amendment 2022",
            "compliant": bool(usp),
            "extracted": usp or "Missing",
            "message": "Unit sale price declared" if usp else "Missing mandatory Unit Sale Price (USP)"
        })
        if not usp:
            violations.append("Mandatory Unit Sale Price (USP) declaration missing under 2022 Amendment Rules")

        # 7. Country of Origin Rule
        coo = declarations.get("country_of_origin")
        rule_checks.append({
            "rule_id": "RULE_6_10_2022",
            "name": "Country of Origin",
            "statute": "Rule 6(10) PCR Amendment 2022",
            "compliant": bool(coo),
            "extracted": coo or "Missing",
            "message": "Country of origin declared" if coo else "Missing Country of Origin statement"
        })
        if not coo:
            violations.append("Country of Origin statement missing (Rule 6(10) Amendment 2022)")

        return {
            "version": cls.VERSION,
            "passed": len(violations) == 0,
            "total_rules": len(rule_checks),
            "passed_rules": sum(1 for r in rule_checks if r["compliant"]),
            "rule_checks": rule_checks,
            "violations": violations
        }
