export interface CreateCalendarEventDto {
    kindergartenId: string;
    groupId?: string;
    title: string;
    description?: string;
    eventDate: string;
    startTime?: string;
    endTime?: string;
    location?: string;
}

export interface CalendarEventResponseDto {
    id: string;
    kindergartenId: string;
    groupId?: string;
    groupName?: string;
    title: string;
    description?: string;
    eventDate: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    updatedAt?: string;
}