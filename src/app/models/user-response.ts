import { Role } from "./role";

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    token: string | null;
    activeTicketId: number | null;
    counterNumber: number | null;
    counterId: number | null;
    agencyName: string | null;
    agencyId: number | null;
}
