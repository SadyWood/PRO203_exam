import { apiGet, apiPost, apiDelete } from "./api";
import { CreateNoteDto, NoteResponseDto } from "./types/note";

export const noteApi = {
    // Get notes for a child
    getNotesByChild: (childId: string) =>
        apiGet<NoteResponseDto[]>(`/api/notes/child/${childId}`),

    // Get notes for a child by date range
    getNotesByChildAndRange: (childId: string, start: string, end: string) =>
        apiGet<NoteResponseDto[]>(`/api/notes/child/${childId}/range?start=${start}&end=${end}`),

    // Get notes for a kindergarten
    getKindergartenNotes: (kindergartenId: string) =>
        apiGet<NoteResponseDto[]>(`/api/notes/kindergarten/${kindergartenId}`),

    // Get notes for a kindergarten by date range
    getKindergartenNotesByRange: (kindergartenId: string, start: string, end: string) =>
        apiGet<NoteResponseDto[]>(`/api/notes/kindergarten/${kindergartenId}/range?start=${start}&end=${end}`),

    // Create a note
    createNote: (data: CreateNoteDto) =>
        apiPost<NoteResponseDto>("/api/notes", data),

    // Delete a note (boss only)
    deleteNote: (noteId: string) =>
        apiDelete<void>(`/api/notes/${noteId}`),
};

// Re-export types
export type { CreateNoteDto, NoteResponseDto } from "./types/note";
