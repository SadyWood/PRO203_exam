export type PersonType = "Parent" | "Staff";

export interface CreateNoteDto {
    childId?: string;
    kindergartenId: string;
    title: string;
    content: string;
    noteDate: string;
}

export interface NoteResponseDto {
    id: string;
    childId?: string;
    childName?: string;
    kindergartenId: string;
    title: string;
    content: string;
    noteDate: string;
    createdBy: string;
    createdByType: PersonType;
    createdByName: string;
    createdAt: string;
    updatedAt?: string;
}