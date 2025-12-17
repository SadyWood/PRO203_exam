export type AbsenceType = "PLANNED" | "UNPLANNED";
export type AbsenceStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PersonType = "Parent" | "Staff";

export interface CreateAbsenceDto {
    childId: string;
    startDate: string;
    endDate: string;
    type: AbsenceType;
    reason?: string;
}

export interface AbsenceResponseDto {
    id: string;
    childId: string;
    childName: string;
    startDate: string;
    endDate: string;
    type: AbsenceType;
    status: AbsenceStatus;
    reason?: string;
    reportedBy: string;
    reportedByType: PersonType;
    reportedByName: string;
    approvedByStaff?: string;
    approvedByStaffName?: string;
    approvedAt?: string;
    createdAt: string;
}