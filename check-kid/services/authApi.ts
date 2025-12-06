import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.10.132:8080";

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
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
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

// Hjelper for senere: hent nåværende bruker fra backend (f.eks. /auth/me)
export async function fetchCurrentUser(): Promise<UserResponseDto | null> {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.log("fetchCurrentUser status:", res.status);
    return null;
  }

  const json = await res.json();
  return json as UserResponseDto;
}
