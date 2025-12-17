import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import {
    HealthDataResponseDto,
    CreateHealthDataDto,
    UpdateHealthDataDto,
} from "./types/health";

export async function getHealthData(childId: string): Promise<HealthDataResponseDto | null> {
    try {
        return await apiGet<HealthDataResponseDto>(`/api/health-data/child/${childId}`);
    } catch (error: any) {
        if (error.message?.includes("404") || error.message?.includes("not found")) {
            return null;
        }
        console.error("getHealthData error:", error);
        return null;
    }
}

export async function createHealthData(
    childId: string,
    data: CreateHealthDataDto
): Promise<HealthDataResponseDto | null> {
    try {
        return await apiPost<HealthDataResponseDto>(`/api/health-data/child/${childId}`, data);
    } catch (error) {
        console.error("createHealthData error:", error);
        return null;
    }
}

export async function updateHealthData(
    childId: string,
    data: UpdateHealthDataDto
): Promise<HealthDataResponseDto | null> {
    try {
        return await apiPut<HealthDataResponseDto>(`/api/health-data/child/${childId}`, data);
    } catch (error) {
        console.error("updateHealthData error:", error);
        return null;
    }
}

export async function deleteHealthData(childId: string): Promise<boolean> {
    try {
        await apiDelete(`/api/health-data/child/${childId}`);
        return true;
    } catch (error) {
        console.error("deleteHealthData error:", error);
        return false;
    }
}