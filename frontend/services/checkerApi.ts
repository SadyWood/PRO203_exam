import { checkerBackend } from "./checkerBackend";
import { checkerMock } from "./checkerMock";

import type {
  CheckInDto,
  CheckOutDto,
  CheckerResponseDto,
} from "./types/checker";

const USE_BACKEND =
  process.env.EXPO_PUBLIC_USE_REAL_BACKEND === "true";


export interface CheckerClient {
  checkIn(dto: CheckInDto): Promise<CheckerResponseDto>;
  checkOut(dto: CheckOutDto): Promise<CheckerResponseDto>;
  confirmCheckIn(checkInId: string): Promise<CheckerResponseDto>;
  getActive(): Promise<CheckerResponseDto[]>;
  getPending(): Promise<CheckerResponseDto[]>;
  getChildStatus(childId: string): Promise<CheckerResponseDto | null>;
  getChildHistory(childId: string): Promise<CheckerResponseDto[]>;
}

const backendClient: CheckerClient = checkerBackend;
const mockClient: CheckerClient = checkerMock as CheckerClient;

export const checkerApi: CheckerClient = USE_BACKEND
  ? backendClient
  : mockClient;

export const checkerApiSource = USE_BACKEND ? "backend" : "mock";

console.log(
  "CHECKER API IS USING:",
  checkerApiSource,
  "| USE_BACKEND =", USE_BACKEND,
  "| API_URL =", process.env.EXPO_PUBLIC_API_URL
);
