import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CheckInDto,
  CheckOutDto,
  CheckerResponseDto,
} from "./types/checker";

const STORAGE_KEY = "checker_mock_statuses_v1";

type LocalStatus = {
  childId: string;
  status: "INN" | "UT";
  lastChange: string; 
  lastRecordId: string;
};

async function loadAll(): Promise<LocalStatus[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalStatus[];
  } catch (e) {
    console.log("Feil ved lesing av mock-checker:", e);
    return [];
  }
}

async function saveAll(list: LocalStatus[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.log("Feil ved lagring av mock-checker:", e);
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function toResponseFromLocal(
  local: LocalStatus,
  extras?: Partial<CheckerResponseDto>,
): CheckerResponseDto {
  return {
    id: local.lastRecordId,
    childId: local.childId,
    checkInDate: local.status === "INN" ? local.lastChange : null,
    droppedOffBy: null,
    droppedOffPersonType: null,
    droppedOffPersonName: null,
    droppedOffConfirmedBy: null,
    checkOutDate: local.status === "UT" ? local.lastChange : null,
    pickedUpBy: null,
    pickedUpPersonType: null,
    pickedUpPersonName: null,
    pickedUpConfirmedBy: null,
    pickedUpConfirmed: false,
    notes: null,
    initializedOn: local.lastChange,
    ...extras,
  };
}

export const checkerMock = {

  async checkIn(dto: CheckInDto): Promise<CheckerResponseDto> {
    const all = await loadAll();
    const now = nowIso();
    const id = `mock-checkin-${dto.childId}-${Date.now()}`;

    const updated: LocalStatus = {
      childId: dto.childId,
      status: "INN",
      lastChange: now,
      lastRecordId: id,
    };

    const merged = [
      ...all.filter((s) => s.childId !== dto.childId),
      updated,
    ];
    await saveAll(merged);

    return toResponseFromLocal(updated, {
      droppedOffBy: dto.droppedOffBy,
      droppedOffPersonType: dto.droppedOffPersonType,
      droppedOffPersonName: dto.droppedOffPersonName,
      droppedOffConfirmedBy: dto.droppedOffConfirmedBy ?? null,
      notes: dto.notes ?? null,
    });
  },

  async checkOut(dto: CheckOutDto): Promise<CheckerResponseDto> {
    const all = await loadAll();
    const now = nowIso();
    const id = `mock-checkout-${dto.childId}-${Date.now()}`;

    const updated: LocalStatus = {
      childId: dto.childId,
      status: "UT",
      lastChange: now,
      lastRecordId: id,
    };

    const merged = [
      ...all.filter((s) => s.childId !== dto.childId),
      updated,
    ];
    await saveAll(merged);

    return toResponseFromLocal(updated, {
      pickedUpBy: dto.pickedUpBy,
      pickedUpPersonType: dto.pickedUpPersonType,
      pickedUpPersonName: dto.pickedUpPersonName,
      pickedUpConfirmedBy: dto.pickedUpConfirmedBy ?? null,
      pickedUpConfirmed: dto.pickedUpConfirmed,
      notes: dto.notes ?? null,
    });
  },

  async confirmCheckIn(checkInId: string): Promise<CheckerResponseDto> {
    // Mock: just return a confirmed response
    return {
      id: checkInId,
      childId: "",
      checkInDate: nowIso(),
      droppedOffBy: null,
      droppedOffPersonType: null,
      droppedOffPersonName: null,
      droppedOffConfirmedBy: "mock-staff-id",
      checkOutDate: null,
      pickedUpBy: null,
      pickedUpPersonType: null,
      pickedUpPersonName: null,
      pickedUpConfirmedBy: null,
      pickedUpConfirmed: false,
      notes: null,
      initializedOn: nowIso(),
    };
  },

  async getActive(): Promise<CheckerResponseDto[]> {
    const all = await loadAll();
    const active = all.filter((s) => s.status === "INN");
    return active.map((s) => toResponseFromLocal(s));
  },

  async getPending(): Promise<CheckerResponseDto[]> {
    // Mock: return empty for now
    return [];
  },

  async getChildStatus(childId: string): Promise<CheckerResponseDto | null> {
    const all = await loadAll();
    const item = all.find((s) => s.childId === childId && s.status === "INN");
    if (!item) return null;
    return toResponseFromLocal(item);
  },

  async getChildHistory(childId: string): Promise<CheckerResponseDto[]> {
    const all = await loadAll();
    const item = all.find((s) => s.childId === childId);
    if (!item) return [];
    return [toResponseFromLocal(item)];
  },
};