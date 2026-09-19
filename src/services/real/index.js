/**
 * Real Implementation Architecture Export Hub
 * Clean interfaces for all 15 production modules.
 * Note: Keep current demo using mock data. Connect this real pipeline when production backend is live.
 */

export { RealApiClient, realApiClient } from './RealApiClient';
export { RealCameraCaptureService, realCameraCaptureService } from './RealCameraCaptureService';
export { RealMultiImageManager } from './RealMultiImageManager';
export { RealQualityCheckerService, realQualityCheckerService } from './RealQualityCheckerService';
export { RealOCRService, realOCRService } from './RealOCRService';
export { RealVLMExtractionService, realVLMExtractionService } from './RealVLMExtractionService';
export { RealCVMeasurementService, realCVMeasurementService } from './RealCVMeasurementService';
export { RealEvidenceVerificationService, realEvidenceVerificationService } from './RealEvidenceVerificationService';
export { RealQRVerificationService, realQRVerificationService } from './RealQRVerificationService';
export { RealRuleEngineService, realRuleEngineService } from './RealRuleEngineService';
export { RealDecisionEngineService, realDecisionEngineService, DECISION_STATES } from './RealDecisionEngineService';
export { RealReportGeneratorService, realReportGeneratorService } from './RealReportGeneratorService';
export { RealDatabaseService, realDatabaseService } from './RealDatabaseService';
