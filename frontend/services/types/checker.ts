export type PersonType = "Parent" | "Staff" | "Other";

export type CheckInDto = {
  childId: string;
  droppedOffBy: string;
  droppedOffPersonType: PersonType;
  droppedOffPersonName: string;
  droppedOffConfirmedBy?: string | null;
  notes?: string | null;
};


export type CheckOutDto = {
  childId: string;
  pickedUpBy: string;
  pickedUpPersonType: PersonType;
  pickedUpPersonName: string;
  pickedUpConfirmedBy?: string | null;
  pickedUpConfirmed: boolean;
  notes?: string | null;
};


export type CheckerResponseDto = {
  id: string;
  childId: string;
  checkInDate: string | null;
  droppedOffBy: string | null;
  droppedOffPersonType: PersonType | null;
  droppedOffPersonName: string | null;
  droppedOffConfirmedBy: string | null;
  checkOutDate: string | null;
  pickedUpBy: string | null;
  pickedUpPersonType: PersonType | null;
  pickedUpPersonName: string | null;
  pickedUpConfirmedBy: string | null;
  pickedUpConfirmed: boolean;
  notes: string | null;
  initializedOn: string | null;
};