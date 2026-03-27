export interface AgencyResponse {
    id: number;
    name: string;
    city: string;
    address: string;
    openingTime: string;
    closingTime: string;
    maxCapacity: number;
    nbrCounters: number
    open: boolean;
    serviceNames: string[];
    queueSize: number;
}
