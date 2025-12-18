import { apiGet, apiPost } from "./api";
import {
    CheckInDto,
    CheckOutDto,
    CheckerResponseDto,
} from "./types/checker";


export const checkerBackend = {
    // Check in a child (parent initiates, staff confirms later)
    checkIn(dto: CheckInDto): Promise<CheckerResponseDto> {
        return apiPost<CheckerResponseDto>("/api/checker/check-in", dto);
    },

    // Check out a child (staff only)
    checkOut(dto: CheckOutDto): Promise<CheckerResponseDto> {
        return apiPost<CheckerResponseDto>("/api/checker/check-out", dto);
    },

    // Confirm a check-in (staff only)
    confirmCheckIn(checkInId: string): Promise<CheckerResponseDto> {
        return apiPost<CheckerResponseDto>(`/api/checker/confirm/${checkInId}`, {});
    },

    // Get all currently checked-in children (staff only)
    getActive(): Promise<CheckerResponseDto[]> {
        return apiGet<CheckerResponseDto[]>("/api/checker/active");
    },

    // Get pending check-ins that need confirmation (staff only)
    getPending(): Promise<CheckerResponseDto[]> {
        return apiGet<CheckerResponseDto[]>("/api/checker/pending");
    },

    // Get current check-in status for a child (returns null if not checked in)
    getChildStatus(childId: string): Promise<CheckerResponseDto | null> {
        return apiGet<CheckerResponseDto | null>(`/api/checker/status/${childId}`);
    },

    // Get check-in/out history for a child
    getChildHistory(childId: string): Promise<CheckerResponseDto[]> {
        return apiGet<CheckerResponseDto[]>(`/api/checker/history/${childId}`);
    },
};
  