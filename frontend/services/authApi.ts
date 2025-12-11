import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";

const API_BASE_URL = Platform.OS === "android"
? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export interface UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: "PARENT" | "STAFF" | "ADMIN";
  profilePictureUrl?: string;
  profileId?: string | null;
}

export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
  // backend heter kanskje isNewUser eller needsRegistration – vi støtter begge:
  isNewUser?: boolean;
  needsRegistration?: boolean;
}

// Hjelper: normaliser feltet so frontend alltid bruker needsRegistration
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
    body: JSON.stringify({ idToken }), // matcher GoogleAuthRequestDto
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log("Login error response:", text);

    let message = "Feil ved innlogging.";
    try {
      const errJson = JSON.parse(text);
      if (errJson.message) message = errJson.message;
    } catch {
      // ignorer JSON-feil
    }
    throw new Error(message);
  }

  const json = await res.json();
  const loginResponse = normalizeLoginResponse(json);

  // Lagre token & user med en gang (ekstra sikkerhet)
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