import {
    CheckInDto,
    CheckOutDto,
    CheckerResponseDto,
  } from "./types/checker";
  
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";
  
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        // TODO: legg til Authorization-header med JWT når auth er på plass
        ...(options?.headers ?? {}),
      },
      ...options,
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        text || `Feil fra backend (${res.status} ${res.statusText}) på ${path}`,
      );
    }
  
    return (await res.json()) as T;
  }
  
  export const checkerBackend = {
    checkIn(dto: CheckInDto): Promise<CheckerResponseDto> {
      return request<CheckerResponseDto>("/api/checker/checkin", {
        method: "POST",
        body: JSON.stringify(dto),
      });
    },
  
    checkOut(dto: CheckOutDto): Promise<CheckerResponseDto> {
      return request<CheckerResponseDto>("/api/checker/checkout", {
        method: "POST",
        body: JSON.stringify(dto),
      });
    },
  
    getActive(): Promise<CheckerResponseDto[]> {
      return request<CheckerResponseDto[]>("/api/checker/active");
    },
  
    getChildHistory(childId: string): Promise<CheckerResponseDto[]> {
      return request<CheckerResponseDto[]>(`/api/checker/history/${childId}`);
    },
  };
  