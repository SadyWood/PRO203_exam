import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import {
    StaffResponseDto,
    KindergartenResponseDto,
    KindergartenUpdateDto,
    GroupResponseDto,
    GroupCreateDto,
    GroupUpdateDto,
    ChildResponseDto,
} from "./types/staff";

// Re-export types for convenience
export type {
    StaffResponseDto,
    KindergartenResponseDto,
    KindergartenUpdateDto,
    GroupResponseDto,
    GroupCreateDto,
    GroupUpdateDto,
    ChildResponseDto,
};

// Staff API endpoints
export const staffApi = {
    // Get current staff by ID
    getCurrentStaff: (staffId: string) =>
        apiGet<StaffResponseDto>(`/api/staff/${staffId}`),

    // Get all staff at kindergarten
    getAllStaffAtKindergarten: () =>
        apiGet<StaffResponseDto[]>("/api/staff"),

    // Promote staff to admin
    promoteToAdmin: (staffId: string) =>
        apiPost<void>(`/api/staff/${staffId}/promote`),

    // Demote staff from admin
    demoteFromAdmin: (staffId: string) =>
        apiPost<void>(`/api/staff/${staffId}/demote`),
};

// Kindergarten API endpoints
export const kindergartenApi = {
    // Get kindergarten by ID
    getKindergarten: (id: string) =>
        apiGet<KindergartenResponseDto>(`/api/kindergartens/${id}`),

    // Update kindergarten
    updateKindergarten: (id: string, data: KindergartenUpdateDto) =>
        apiPut<KindergartenResponseDto>(`/api/kindergartens/${id}`, data),
};

// Group API endpoints
export const groupApi = {
    // Get all groups for a kindergarten
    getGroupsByKindergarten: (kindergartenId: string) =>
        apiGet<GroupResponseDto[]>(`/api/groups/kindergarten/${kindergartenId}`),

    // Create a new group
    createGroup: (data: GroupCreateDto) =>
        apiPost<GroupResponseDto>("/api/groups", data),

    // Update a group
    updateGroup: (id: string, data: GroupUpdateDto) =>
        apiPut<GroupResponseDto>(`/api/groups/${id}`, data),

    // Delete a group
    deleteGroup: (id: string) =>
        apiDelete<void>(`/api/groups/${id}`),

    // Assign staff to group
    assignStaffToGroup: (groupId: string, staffId: string, isResponsible: boolean = false) =>
        apiPost<void>(`/api/groups/${groupId}/staff/${staffId}`, { responsible: isResponsible }),

    // Remove staff from group
    removeStaffFromGroup: (groupId: string, staffId: string) =>
        apiDelete<void>(`/api/groups/${groupId}/staff/${staffId}`),

    // Assign child to group
    assignChildToGroup: (groupId: string, childId: string) =>
        apiPost<void>(`/api/groups/${groupId}/children/${childId}`),

    // Remove child from group
    removeChildFromGroup: (groupId: string, childId: string) =>
        apiDelete<void>(`/api/groups/${groupId}/children/${childId}`),
};

// Children API endpoint for staff view
export const childrenApi = {
    // Get all children (filtered by role on backend)
    getAllChildren: () =>
        apiGet<ChildResponseDto[]>("/api/children"),

    // Get child by ID
    getChildById: (childId: string) =>
        apiGet<ChildResponseDto>(`/api/children/${childId}`),
};
