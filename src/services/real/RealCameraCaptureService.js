/**
 * Real Implementation Camera Capture Service
 * WebRTC media stream initialization, constraint configuration, frame grabbing, resolution validation.
 */

export class RealCameraCaptureService {
    constructor() {
        this.mediaStream = null;
        this.activeTrack = null;
    }

    /**
     * Initializes camera video stream with HD constraints (1080p target).
     */
    async initializeCamera(videoElement, preferredFacingMode = 'environment') {
        const constraints = {
            video: {
                facingMode: { ideal: preferredFacingMode },
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                focusMode: { ideal: 'continuous' }
            },
            audio: false
        };

        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoElement) {
                videoElement.srcObject = this.mediaStream;
                await videoElement.play();
            }
            const tracks = this.mediaStream.getVideoTracks();
            if (tracks.length > 0) {
                this.activeTrack = tracks[0];
            }
            return {
                success: true,
                stream: this.mediaStream,
                settings: this.activeTrack ? this.activeTrack.getSettings() : {}
            };
        } catch (error) {
            console.error('[RealCameraCaptureService] Camera initialization error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Captures high-resolution frame from active video element into base64 data URL.
     */
    captureFrame(videoElement) {
        if (!videoElement || videoElement.readyState < 2) {
            throw new Error('Video stream is not ready for capture');
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth || 1920;
        canvas.height = videoElement.videoHeight || 1080;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        return {
            dataUrl,
            width: canvas.width,
            height: canvas.height,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Stops camera hardware stream.
     */
    stopCamera() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
            this.activeTrack = null;
        }
    }
}

export const realCameraCaptureService = new RealCameraCaptureService();
