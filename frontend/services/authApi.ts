import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch, apiPost, API_BASE_URL } from "./api";
import {
    UserResponseDto,
    LoginResponseDto,
    RegistrationRole,
    CompleteRegistrationDto,
} from "./types/auth"


function normalizeLoginResponse(json: any): LoginResponseDto {
  return {
    token: json.token,
    user: json.user,
    isNewUser: json.isNewUser,
    needsRegistration:
      json.needsRegistration ?? json.isNewUser ?? false,
  };
}

// Google login - public endpoint (no JWT needed)
export async function loginWithGoogle(idToken: string): Promise<LoginResponseDto> {
    const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        let message = "Login failed.";
        try {
            const errJson = JSON.parse(text);
            if (errJson.message) message = errJson.message;
        } catch {}
        throw new Error(message);
    }

    const json = await res.json();

    const loginResponse: LoginResponseDto = {
        token: json.token,
        user: json.user,
        isNewUser: json.isNewUser,
        needsRegistration: json.needsRegistration ?? json.isNewUser ?? false,
    };

    // Store token and user
    await AsyncStorage.setItem("authToken", loginResponse.token);
    await AsyncStorage.setItem("currentUser", JSON.stringify(loginResponse.user));

    return loginResponse;
}

export async function fetchCurrentUser(endpoint: string, options: RequestInit = {}): Promise<Response> {

  const token = await AsyncStorage.getItem("authToken");

  if (!token) {
    throw new Error("no token");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("currentUser");
  }

  return res;
}

// Get current user - requires JWT
export async function getCurrentUser(): Promise<UserResponseDto | null> {
    try {
        const user = await apiFetch<UserResponseDto>("/api/auth/me");
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        return user;
    } catch (error) {
        console.error("getCurrentUser error:", error);
        return null;
    }
}

// Complete registration - requires JWT
export async function completeRegistration(
    role: RegistrationRole,
    data: CompleteRegistrationDto
): Promise<UserResponseDto> {
    const user = await apiPost<UserResponseDto>(
        `/api/auth/complete-registration/${role.toLowerCase()}`,
        data
    );

    await AsyncStorage.setItem("currentUser", JSON.stringify(user));
    return user;
}

// Accept Terms of Service - requires JWT
export async function acceptTos(tosVersion: string = "1.0"): Promise<void> {
    await apiPost("/api/auth/accept-tos", { tosVersion });
}

// Get cached user from storage - no API call
export async function getCachedUser(): Promise<UserResponseDto | null> {
    const userStr = await AsyncStorage.getItem("currentUser");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr) as UserResponseDto;
    } catch {
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
}

export async function logout(): Promise<void> {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("currentUser");
}
