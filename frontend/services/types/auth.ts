export interface UserResponseDto {
    id: string;
    fullName: string;
    email: string;
    role: "PARENT" | "STAFF" | "BOSS";
    profilePictureUrl?: string;
    profileId?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    employeeId?: string | null;
    position?: string | null;
    kindergartenId?: string | null;
    tosAccepted?: boolean;
}

export interface LoginResponseDto {
    token: string;
    user: UserResponseDto;
    isNewUser?: boolean;
    needsRegistration?: boolean;
}

export type RegistrationRole = "PARENT" | "STAFF" | "BOSS";

export interface CompleteRegistrationDto {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    employeeId?: string;
    position?: string;
    kindergartenName?: string;
    kindergartenAddress?: string;
}