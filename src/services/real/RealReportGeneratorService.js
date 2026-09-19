/**
 * Real Implementation Report Generator Service
 * Assembles official JSON inspection certificate payload and triggers client PDF downloads.
 */

export class RealReportGeneratorService {
    /**
     * Builds full inspection report certificate object.
     */
    buildInspectionCertificate(scanId, qualityRes, declarations, measurements, ruleRes, decisionRes, evidenceBundle) {
        return {
            certificateHeader: {
                certificateId: `CERT-INSP-${scanId.slice(0, 8).toUpperCase()}`,
                scanId,
                issuedAt: new Date().toISOString(),
                issuingAuthority: 'Product Compliance Inspection Directorate'
            },
            verdict: decisionRes,
            quality: qualityRes,
            declarations,
            measurements,
            ruleEvaluation: ruleRes,
            evidenceChain: evidenceBundle
        };
    }

    /**
     * Triggers browser download of inspection report JSON.
     */
    downloadJsonReport(reportObject) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportObject, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `Inspection_Report_${reportObject.certificateHeader.scanId}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
}

export const realReportGeneratorService = new RealReportGeneratorService();
