/**
 * Real Implementation Decision Engine Service
 * Tri-state verdict solver resolving output into COMPLIANT, NON_COMPLIANT, or INDETERMINATE.
 */

export const DECISION_STATES = {
    COMPLIANT: 'COMPLIANT',
    NON_COMPLIANT: 'NON_COMPLIANT',
    INDETERMINATE: 'INDETERMINATE'
};

export class RealDecisionEngineService {
    /**
     * Resolves tri-state verdict based on Quality, VLM extraction confidence, and Rule Engine violations.
     */
    evaluateDecision(qualityResult, vlmResult, ruleResult) {
        const qualityPass = qualityResult ? qualityResult.overallPass : true;
        const confidenceScore = vlmResult ? (vlmResult.confidence_score || 0.95) : 0.95;
        const violations = ruleResult ? ruleResult.violations : [];

        let decision = DECISION_STATES.COMPLIANT;
        let riskLevel = 'Low';
        let reason = 'Package satisfies all statutory compliance provisions.';

        if (!qualityPass || confidenceScore < 0.75) {
            decision = DECISION_STATES.INDETERMINATE;
            riskLevel = 'Medium';
            reason = 'Unclear package image quality or low OCR/VLM extraction confidence. Required manual officer inspection.';
        } else if (violations.length > 0) {
            decision = DECISION_STATES.NON_COMPLIANT;
            riskLevel = violations.length >= 2 ? 'High' : 'Medium';
            reason = `Identified ${violations.length} statutory breach(es) under compliance rules.`;
        }

        const complianceScore = Math.round(((ruleResult ? ruleResult.passedRules : 5) / (ruleResult ? ruleResult.totalRules : 5)) * 100);

        return {
            decision,
            complianceScore,
            riskLevel,
            reason,
            violationsCount: violations.length,
            violations,
            requiresManualReview: decision === DECISION_STATES.INDETERMINATE
        };
    }
}

export const realDecisionEngineService = new RealDecisionEngineService();
