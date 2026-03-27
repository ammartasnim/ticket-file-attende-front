import { Status } from "./status";

export interface TicketResponse {
    id: number;
    uuid: string;
    pin: number;
    status: Status;
    appointmentDate: string;

    serviceName: string;
    agencyName: string;
    agencyAddress: string;
    clientName: string;
    counterNumber: number;

    queuePosition: number;
    estimatedWaitTime: number;
}
