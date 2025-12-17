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

export interface CreateHealthDataDto {
    medicalConditions?: string;
    allergies?: string;
    medications?: string;
    emergencyContact?: string;
    dietaryRestrictions?: string;
}

export interface UpdateHealthDataDto {
    medicalConditions?: string;
    allergies?: string;
    medications?: string;
    emergencyContact?: string;
    dietaryRestrictions?: string;
}