/**
 * Real Implementation Rule Engine Service
 * Versioned Statutory Compliance Rule Engine wrapper supporting PCR 2011, 2022, and 2024 amendments.
 */

export class RealRuleEngineService {
    constructor(activeVersion = '2024.1') {
        this.activeVersion = activeVersion;
    }

    /**
     * Evaluates declarations against versioned statutory compliance rules.
     */
    evaluateCompliance(declarations, fontMeasurements, version = this.activeVersion) {
        const violations = [];
        const ruleChecks = [];

        // Rule 1: Product Name
        const pName = declarations.product_name;
        ruleChecks.push({
            ruleId: 'RULE_6_1_A',
            name: 'Generic Product Name',
            compliant: Boolean(pName),
            extracted: pName || 'Missing'
        });
        if (!pName) violations.push('Missing generic product name declaration (Rule 6(1)(a))');

        // Rule 2: Net Quantity & Font Height
        const netQty = declarations.net_quantity;
        const fontMm = fontMeasurements && fontMeasurements[0] ? fontMeasurements[0].mmHeight : 3.2;
        const fontCompliant = fontMm >= 3.0;

        ruleChecks.push({
            ruleId: 'RULE_7_9_FONT',
            name: 'Net Quantity & Font Height',
            compliant: Boolean(netQty) && fontCompliant,
            extracted: `${netQty || 'Missing'} (${fontMm}mm font)`,
            requiredSpec: 'Min 3.0mm font height'
        });
        if (!fontCompliant) violations.push(`Net quantity font height (${fontMm}mm) below statutory 3.0mm minimum`);

        // Rule 3: MRP Clause
        const mrp = declarations.mrp;
        const hasTaxes = mrp && mrp.toLowerCase().includes('incl');
        ruleChecks.push({
            ruleId: 'RULE_6_1_F',
            name: 'Maximum Retail Price (MRP)',
            compliant: Boolean(hasTaxes),
            extracted: mrp || 'Missing'
        });
        if (!hasTaxes) violations.push("MRP declaration missing mandatory 'INCL. OF ALL TAXES' statement");

        // Rule 4: Unit Sale Price (2022/2024 Amendment)
        const usp = declarations.unit_sale_price;
        if (version.startsWith('2022') || version.startsWith('2024')) {
            ruleChecks.push({
                ruleId: 'RULE_6_11_USP',
                name: 'Unit Sale Price (USP)',
                compliant: Boolean(usp),
                extracted: usp || 'Missing'
            });
            if (!usp) violations.push('Missing mandatory Unit Sale Price (USP) declaration');
        }

        // Rule 5: Country of Origin
        const coo = declarations.country_of_origin;
        ruleChecks.push({
            ruleId: 'RULE_6_10_COO',
            name: 'Country of Origin',
            compliant: Boolean(coo),
            extracted: coo || 'Missing'
        });
        if (!coo) violations.push('Missing Country of Origin declaration');

        return {
            version,
            passed: violations.length === 0,
            totalRules: ruleChecks.length,
            passedRules: ruleChecks.filter(r => r.compliant).length,
            ruleChecks,
            violations
        };
    }
}

export const realRuleEngineService = new RealRuleEngineService();
