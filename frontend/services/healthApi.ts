import {Platform} from "react-native";
import {HealthDataInterface} from "@/models/health";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export async function getHealthData(childId: string): Promise<HealthDataInterface | null>{
    try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("no token");

        const res = await fetch(`${API_BASE_URL}/api/health-data/child/${childId}`, {
            headers: {
                Authorization: `Bearer $${token}`,
            },
        });

        if (!res.ok){
            if(res.status === 404) return null;
            throw new Error("Failed on fetch");
        }

        return await res.json();

    }catch (error){

        console.error(error);
        return null;
    }
}

export async function updateHealthData(
    childId: string, data: Partial<HealthDataInterface>): Promise<HealthDataInterface | null>{
    try {

        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("no token");

        const res = await fetch(`${API_BASE_URL}/api/health-data/child/${childId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            });

        if (!res.ok){
            throw new Error("failed to update");
        }

        return await res.json();

    }catch (error){
        console.error(error);
        return null;
    }
}

export async function createHealthData(
    childId: string, data: Partial<HealthDataInterface>): Promise<HealthDataInterface | null>{
    try {

        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("no token");

        const res = await fetch(`${API_BASE_URL}/api/health-data/child/${childId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok){
            throw new Error("failed to update");
        }

        return await res.json();

    }catch (error){
        console.error(error);
        return null;
    }
}