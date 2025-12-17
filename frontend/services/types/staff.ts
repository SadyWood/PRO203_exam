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
    kindergartenId: string;
    childIds: string[];
    staffIds: string[];
}

// Group create DTO
export interface GroupCreateDto {
    name: string;
    kindergartenId: string;
}

// Group update DTO
export interface GroupUpdateDto {
    name?: string;
}

// Child response DTO (for staff view)
export interface ChildResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    groupId?: string;
    parentIds: string[];
    profilePictureUrl?: string;
}
