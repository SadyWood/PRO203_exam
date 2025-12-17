import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";

const API_BASE_URL = Platform.OS === "android"
? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export interface UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: "PARENT" | "STAFF" | "ADMIN" | "BOSS";
  profilePictureUrl?: string;
  profileId?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  employeeId?: string | null;
  position?: string | null;
}

export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
  isNewUser?: boolean;
  needsRegistration?: boolean;
}

export type RegistrationRole = "PARENT" | "STAFF";

export interface CompleteRegistrationDto {
  role: RegistrationRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  employeeId?: string;
  position?: string;
}

function normalizeLoginResponse(json: any): LoginResponseDto {
  return {
    token: json.token,
    user: json.user,
    isNewUser: json.isNewUser,
    needsRegistration:
      json.needsRegistration ?? json.isNewUser ?? false,
  };
}

export async function loginWithGoogle(idToken: string): Promise<LoginResponseDto> {
  const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log("Login error response:", text);

    let message = "Feil ved innlogging.";
    try {
      const errJson = JSON.parse(text);
      if (errJson.message) message = errJson.message;
    } catch {

    }
    throw new Error(message);
  }

  const json = await res.json();
  const loginResponse = normalizeLoginResponse(json);

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

export async function getCurrentUser(): Promise<UserResponseDto | null> {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        console.log("fetchCurrentUser status:", res.status);
        if (res.status === 401 || res.status === 403) {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("currentUser");
        }
        return null;
    }

    const json = await res.json();
    const user = json as UserResponseDto;

    await AsyncStorage.setItem("currentUser", JSON.stringify(user));

    return user;
}

export async function completeRegistration(
  data: CompleteRegistrationDto
): Promise<UserResponseDto> {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    throw new Error("Ingen auth-token funnet. Logg inn på nytt.");
  }

  const userJson = await AsyncStorage.getItem("currentUser");
  if(!userJson){
    throw new Error("Ingen brukerdata funnet. Logg inn på nytt.");
  }
  const usera = JSON.parse(userJson);
  const userId = usera.id

  const res = await fetch(`${API_BASE_URL}/api/auth/complete-registration/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log("Complete registration error:", text);
    let message = "Feil ved registrering.";
    try {
      const errJson = JSON.parse(text);
      if (errJson.message) message = errJson.message;
    } catch {

    }
    throw new Error(message);
  }

  const user = (await res.json()) as UserResponseDto;

  await AsyncStorage.setItem("currentUser", JSON.stringify(user));

  return user;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("currentUser");
}
