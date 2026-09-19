/**
 * Real Implementation Database Service
 * Handles persistence, offline queueing, and sync of inspection scans with production database API.
 */

import { realApiClient } from './RealApiClient';

export class RealDatabaseService {
    constructor() {
        this.offlineQueueKey = 'real_inspection_offline_queue';
    }

    /**
     * Saves completed scan inspection to database backend or offline storage.
     */
    async saveScanRecord(scanRecord) {
        if (!navigator.onLine) {
            this.enqueueOffline(scanRecord);
            return {
                synced: false,
                offlineQueued: true,
                message: 'Scan cached in browser IndexedDB/LocalStorage queue. Will sync when back online.'
            };
        }

        try {
            const response = await realApiClient.processFullScan({
                image_base64: scanRecord.dataUrl || '',
                officer_id: scanRecord.officerId || 'OFFICER-001',
                rule_version: scanRecord.ruleVersion || '2024.1'
            });

            return {
                synced: true,
                offlineQueued: false,
                recordId: response.scan_id,
                response
            };
        } catch (error) {
            console.warn('[RealDatabaseService] API sync failed, queueing offline:', error);
            this.enqueueOffline(scanRecord);
            return {
                synced: false,
                offlineQueued: true,
                message: 'API error. Scan stored in offline queue.'
            };
        }
    }

    /**
     * Add record to localStorage offline queue.
     */
    enqueueOffline(record) {
        const queue = this.getOfflineQueue();
        queue.push({
            ...record,
            queuedAt: new Date().toISOString()
        });
        localStorage.setItem(this.offlineQueueKey, JSON.stringify(queue));
    }

    /**
     * Retrieve offline queued records.
     */
    getOfflineQueue() {
        try {
            const data = localStorage.getItem(this.offlineQueueKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }
}

export const realDatabaseService = new RealDatabaseService();
