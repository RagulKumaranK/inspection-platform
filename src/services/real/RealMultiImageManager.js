/**
 * Real Implementation Multi-Image Manager
 * Aggregates front, back, top, bottom, and side package views and tracks coverage.
 */

export class RealMultiImageManager {
    constructor(sessionId = null) {
        this.sessionId = sessionId || `SESS-${Date.now()}`;
        this.capturedPanels = new Map();
    }

    /**
     * Add panel capture.
     */
    addPanel(panelType, dataUrl, metadata = {}) {
        const record = {
            panelType: panelType.toLowerCase(),
            dataUrl,
            metadata,
            timestamp: new Date().toISOString()
        };
        this.capturedPanels.set(panelType.toLowerCase(), record);
        return record;
    }

    /**
     * Remove panel.
     */
    removePanel(panelType) {
        this.capturedPanels.delete(panelType.toLowerCase());
    }

    /**
     * Get panel list.
     */
    getPanels() {
        return Array.from(this.capturedPanels.values());
    }

    /**
     * Check if mandatory panels (front & back) are captured.
     */
    getCompletenessStatus() {
        const captured = Array.from(this.capturedPanels.keys());
        const hasFront = captured.includes('front');
        const hasBack = captured.includes('back');
        const isComplete = hasFront && hasBack;

        return {
            sessionId: this.sessionId,
            isComplete,
            capturedPanels: captured,
            missingRequired: [!hasFront && 'front', !hasBack && 'back'].filter(Boolean),
            totalImages: captured.length
        };
    }
}
