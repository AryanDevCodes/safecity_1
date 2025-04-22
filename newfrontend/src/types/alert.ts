export interface Alert {
    id: string;
    type: string;
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
    details?: string;
    location: string;
    latitude: number;
    longitude: number;
    userId?: string;
    respondingOfficerId?: string;
    createdAt: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    distance?: number; // Distance from current officer location in km
}