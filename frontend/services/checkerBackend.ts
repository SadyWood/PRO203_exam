import { apiGet, apiPost } from "./api";
import {
    CheckInDto,
    CheckOutDto,
    CheckerResponseDto,
} from "./types/checker";


export const checkerBackend = {
    // Check in a child
    checkIn(dto: CheckInDto): Promise<CheckerResponseDto> {
        return apiPost<CheckerResponseDto>("/api/checker/check-in", dto);
    },

    // Check out a child
    checkOut(dto: CheckOutDto): Promise<CheckerResponseDto> {
        return apiPost<CheckerResponseDto>("/api/checker/check-out", dto);
    },

    // Get all currently checked-in children
    getActive(): Promise<CheckerResponseDto[]> {
        return apiGet<CheckerResponseDto[]>("/api/checker/active");
    },

    // Get check-in/out history for a child
    getChildHistory(childId: string): Promise<CheckerResponseDto[]> {
        return apiGet<CheckerResponseDto[]>(`/api/checker/history/${childId}`);
    },
};
  