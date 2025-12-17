import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Base URL based on platform
const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

// Centralized fetch with JWT
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await AsyncStorage.getItem("authToken");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Add JWT if available
    if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle 401 - token expired/invalid
    if (res.status === 401) {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("currentUser");
        throw new Error("Session expired. Please login again.");
    }

    // Handle other errors
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        let message = `Request failed (${res.status})`;
        try {
            const errJson = JSON.parse(text);
            if (errJson.message) message = errJson.message;
        } catch {}
        throw new Error(message);
    }

    // Handle empty response
    const text = await res.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
}

// Helper for GET requests
export function apiGet<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: "GET" });
}

// Helper for POST requests
export function apiPost<T>(endpoint: string, body?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
    });
}

// Helper for PUT requests
export function apiPut<T>(endpoint: string, body?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
    });
}

// Helper for DELETE requests
export function apiDelete<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: "DELETE" });
}

export { API_BASE_URL };