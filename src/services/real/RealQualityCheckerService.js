/**
 * Real Implementation Client Image Quality Checker
 * Real-time HTML5 Canvas analysis for blur (variance of Laplacian estimation) and lighting contrast.
 */

export class RealQualityCheckerService {
    /**
     * Evaluates HTML Image or Canvas image data for blur and illumination.
     */
    async evaluateClientFrameQuality(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = Math.min(img.width, 640);
                canvas.height = Math.min(img.height, 480);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                // 1. Calculate Mean Brightness & Variance
                let sumLuminance = 0;
                const grayscale = new Float32Array(pixels.length / 4);

                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                    grayscale[i / 4] = lum;
                    sumLuminance += lum;
                }

                const avgBrightness = sumLuminance / grayscale.length;

                // 2. Simple Laplacian Variance Blur Estimate
                let laplacianSum = 0;
                const w = canvas.width;
                const h = canvas.height;

                for (let y = 1; y < h - 1; y += 2) {
                    for (let x = 1; x < w - 1; x += 2) {
                        const idx = y * w + x;
                        const center = grayscale[idx];
                        const lap = (
                            4 * center -
                            grayscale[idx - 1] -
                            grayscale[idx + 1] -
                            grayscale[idx - w] -
                            grayscale[idx + w]
                        );
                        laplacianSum += lap * lap;
                    }
                }

                const blurScore = Math.round(laplacianSum / ((w * h) / 4));
                const isSharp = blurScore > 150;
                const isLightingOptimal = avgBrightness >= 40 && avgBrightness <= 220;
                const overallPass = isSharp && isLightingOptimal;

                resolve({
                    overallPass,
                    qualityScore: Math.min(Math.round((blurScore / 300) * 50 + (avgBrightness / 220) * 50), 100),
                    blurCheck: {
                        score: blurScore,
                        isSharp,
                        message: isSharp ? 'Image sharp' : 'Image appears blurry'
                    },
                    illuminationCheck: {
                        brightness: Math.round(avgBrightness),
                        isOptimal: isLightingOptimal,
                        message: isLightingOptimal ? 'Optimal lighting' : 'Check lighting exposure'
                    }
                });
            };
            img.src = dataUrl;
        });
    }
}

export const realQualityCheckerService = new RealQualityCheckerService();
