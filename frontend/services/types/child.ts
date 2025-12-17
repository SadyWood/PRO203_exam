export interface ChildResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    profilePictureUrl?: string;
    kindergartenId: string;
    groupId?: string;
    groupName?: string;
    healthDataId?: string;
}

export interface CreateChildDto {
    firstName: string;
    lastName: string;
    birthDate: string;
    kindergartenId: string;
    groupId?: string;
}

export interface UpdateChildDto {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    groupId?: string;
    profilePictureUrl?: string;
}