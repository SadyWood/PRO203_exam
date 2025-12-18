// Staff response DTO
export interface StaffResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    employeeId?: string;
    position?: string;
    kindergartenId: string;
    isAdmin: boolean;
}

// Kindergarten response DTO
export interface KindergartenResponseDto {
    id: string;
    name: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
}

// Kindergarten update DTO
export interface KindergartenUpdateDto {
    name?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
}

// Group response DTO
export interface GroupResponseDto {
    id: string;
    name: string;
    description?: string;
    kindergartenId: string;
    ageRange?: string;
    maxCapacity?: number;
    childCount: number;
    staffCount: number;
    // For frontend tracking of members - populated by separate API calls
    childIds?: string[];
    staffIds?: string[];
}

// Group create DTO
export interface GroupCreateDto {
    name: string;
    kindergartenId: string;
    maxCapacity?: number;
}

// Group update DTO
export interface GroupUpdateDto {
    name?: string;
    maxCapacity?: number;
}

// Child response DTO (for staff view)
export interface ChildResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    groupName?: string;
    groupId?: string;
    kindergartenId?: string;
    kindergartenName?: string;
    checkedIn?: boolean;
}

// Health data response DTO
export interface HealthDataResponseDto {
    id: string;
    childId: string;
    childName?: string;
    medicalConditions?: string;
    allergies?: string;
    medications?: string;
    emergencyContact?: string;
    dietaryRestrictions?: string;
    lastEditedBy?: string;
    lastEditedAt?: string;
}

// Parent response DTO
export interface ParentResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    canPickup?: boolean;
}

// Parent-child relationship DTO
export interface ParentChildDto {
    id: string;
    parentId: string;
    childId: string;
    relationStatus?: string;
    canCheckOut?: boolean;
    canCheckIn?: boolean;
    isPrimaryContact?: boolean;
    requiredVerification?: boolean;
}

// Calendar event response DTO
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
    isSpecialOccasion?: boolean;  // Flag for trips, special days, etc.
    createdBy?: string;
    createdByName?: string;
    createdAt?: string;
}

// Calendar event create DTO
export interface CreateCalendarEventDto {
    kindergartenId: string;
    groupId?: string;  // NULL = kindergarten-wide event
    title: string;
    description?: string;
    eventDate: string;  // ISO date string (YYYY-MM-DD)
    startTime?: string; // HH:mm format
    endTime?: string;   // HH:mm format
    location?: string;
    isSpecialOccasion?: boolean;
}

// Calendar event update DTO
export interface UpdateCalendarEventDto {
    groupId?: string;
    title?: string;
    description?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    isSpecialOccasion?: boolean;
}
