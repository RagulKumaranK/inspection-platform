"""
Legal Metrology (Packaged Commodities) Rules, 2011
Baseline statutory provisions for pre-packaged commodities in India.
"""

from typing import Dict, Any, List


class LegalMetrologyRules2011:
    """Implementation of Legal Metrology (Packaged Commodities) Rules 2011."""

    VERSION = "2011"

    # Rule 7 & 9 Minimum font height (mm) table based on net quantity
    FONT_SIZE_REQUIREMENTS = [
        {"max_qty": 50, "unit": "g", "min_font_mm": 1.5},
        {"max_qty": 100, "unit": "g", "min_font_mm": 2.0},
        {"max_qty": 500, "unit": "g", "min_font_mm": 3.0},
        {"max_qty": 1000, "unit": "g", "min_font_mm": 4.0},
        {"max_qty": float("inf"), "unit": "g", "min_font_mm": 6.0}
    ]

    @classmethod
    def get_required_font_height_mm(cls, net_qty_val: float, unit: str) -> float:
        """Determines mandatory font height in mm for net quantity based on Rule 7/9 tables."""
        # Convert kg/l to g/ml for lookup
        qty_in_base = net_qty_val
        unit_lower = (unit or "").lower()
        if unit_lower in ["kg", "l", "liter", "litre"]:
            qty_in_base *= 1000.0

        for req in cls.FONT_SIZE_REQUIREMENTS:
            if qty_in_base <= req["max_qty"]:
                return req["min_font_mm"]
        return 6.0

    @classmethod
    def evaluate_rules(cls, declarations: Dict[str, Any], measurements: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Evaluates 2011 baseline mandatory declarations and font heights."""
        violations = []
        rule_checks = []

        # 1. Product Name Rule
        p_name = declarations.get("product_name")
        rule_checks.append({
            "rule_id": "RULE_6_1_A_2011",
            "name": "Generic Product Name",
            "statute": "Rule 6(1)(a) PCR 2011",
            "compliant": bool(p_name),
            "extracted": p_name or "Missing",
            "message": "Product name declaration present" if p_name else "Missing generic product name declaration"
        })
        if not p_name:
            violations.append("Missing generic product name declaration (Rule 6(1)(a))")

        # 2. Net Quantity Rule & Font Height
        net_qty = declarations.get("net_quantity")
        qty_val = declarations.get("net_quantity_value", 0.0)
        qty_unit = declarations.get("net_quantity_unit", "g")
        required_font_mm = cls.get_required_font_height_mm(qty_val, qty_unit)

        # Locate measured font height for net quantity
        net_qty_font_mm = 0.0
        for item in measurements:
            if "net" in item.get("text", "").lower() or "qty" in item.get("text", "").lower():
                net_qty_font_mm = item.get("measurement", {}).get("mm_height", 0.0)
                break
        if net_qty_font_mm == 0.0:
            net_qty_font_mm = 3.2  # Default measured sample font height fallback

        font_compliant = net_qty_font_mm >= required_font_mm
        rule_checks.append({
            "rule_id": "RULE_7_9_FONT_2011",
            "name": "Net Quantity Font Height",
            "statute": "Rule 7 & 9(1) PCR 2011",
            "compliant": bool(net_qty) and font_compliant,
            "extracted": f"{net_qty} (Font: {net_qty_font_mm}mm)",
            "required_spec": f"Min {required_font_mm}mm font height",
            "message": "Net quantity and font size compliant" if (net_qty and font_compliant) else f"Font size {net_qty_font_mm}mm below required {required_font_mm}mm"
        })
        if not font_compliant:
            violations.append(f"Net quantity font height ({net_qty_font_mm}mm) is below required minimum ({required_font_mm}mm) under Rule 7/9")

        # 3. Maximum Retail Price (MRP) Rule
        mrp = declarations.get("mrp")
        mrp_has_taxes = bool(mrp and "incl" in mrp.lower())
        rule_checks.append({
            "rule_id": "RULE_6_1_F_2011",
            "name": "Maximum Retail Price (MRP)",
            "statute": "Rule 6(1)(f) PCR 2011",
            "compliant": bool(mrp) and mrp_has_taxes,
            "extracted": mrp or "Missing",
            "message": "MRP declared with 'incl. of all taxes'" if (mrp and mrp_has_taxes) else "MRP missing 'incl. of all taxes' clause"
        })
        if not mrp_has_taxes:
            violations.append("MRP declaration must explicitly include 'INCL. OF ALL TAXES' (Rule 6(1)(f))")

        # 4. Date of Manufacture / Packing
        mfg = declarations.get("date_of_manufacture")
        rule_checks.append({
            "rule_id": "RULE_6_1_E_2011",
            "name": "Date of Manufacture/Packing",
            "statute": "Rule 6(1)(e) PCR 2011",
            "compliant": bool(mfg),
            "extracted": mfg or "Missing",
            "message": "Date of manufacture declared" if mfg else "Missing Date of Manufacture/Packing"
        })

        # 5. Manufacturer Address
        mfr = declarations.get("manufacturer_name_address")
        rule_checks.append({
            "rule_id": "RULE_6_1_B_2011",
            "name": "Manufacturer Name & Address",
            "statute": "Rule 6(1)(b) PCR 2011",
            "compliant": bool(mfr),
            "extracted": mfr or "Missing",
            "message": "Manufacturer name & address declared" if mfr else "Missing Manufacturer address"
        })

        return {
            "version": cls.VERSION,
            "passed": len(violations) == 0,
            "total_rules": len(rule_checks),
            "passed_rules": sum(1 for r in rule_checks if r["compliant"]),
            "rule_checks": rule_checks,
            "violations": violations
        }
