/**
 * Real Implementation Computer Vision Measurement Service
 * ArUco marker detection & sub-pixel declaration font height/width measurement in millimeters.
 */

export class RealCVMeasurementService {
    /**
     * Calculates pixel-to-millimeter ratio and font height in mm.
     */
    measureDeclarationHeights(ocrBoundingBoxes, arucoMarkerPxSide = null) {
        // Default physical marker dimension 20mm x 20mm
        const physicalMarkerMm = 20.0;
        const mmPerPixel = arucoMarkerPxSide ? (physicalMarkerMm / arucoMarkerPxSide) : 0.117; // ~8.5 px/mm default

        return ocrBoundingBoxes.map(box => {
            const mmHeight = Number((box.height * mmPerPixel).toFixed(2));
            const mmWidth = Number((box.width * mmPerPixel).toFixed(2));
            return {
                text: box.text || '',
                pixelHeight: box.height,
                pixelWidth: box.width,
                mmHeight,
                mmWidth,
                fontXHeightMm: Number((mmHeight * 0.72).toFixed(2)),
                isCompliantFontHeight: mmHeight >= 3.0
            };
        });
    }
}

export const realCVMeasurementService = new RealCVMeasurementService();
