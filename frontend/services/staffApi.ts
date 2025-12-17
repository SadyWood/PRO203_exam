import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import {
    StaffResponseDto,
    KindergartenResponseDto,
    KindergartenUpdateDto,
    GroupResponseDto,
    GroupCreateDto,
    GroupUpdateDto,
    ChildResponseDto,
    HealthDataResponseDto,
    ParentResponseDto,
    ParentChildDto,
    CalendarEventResponseDto,
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
    HealthDataResponseDto,
    ParentResponseDto,
    ParentChildDto,
    CalendarEventResponseDto,
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

    // Get children in a group
    getChildrenInGroup: (groupId: string) =>
        apiGet<string[]>(`/api/groups/${groupId}/children`),

    // Get staff in a group
    getStaffInGroup: (groupId: string) =>
        apiGet<string[]>(`/api/groups/${groupId}/staff`),

    // Get groups by staff member
    getGroupsByStaff: (staffId: string) =>
        apiGet<GroupResponseDto[]>(`/api/groups/staff/${staffId}`),
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

// Health data API endpoints
export const healthApi = {
    // Get health data for a child
    getHealthDataByChild: (childId: string) =>
        apiGet<HealthDataResponseDto>(`/api/health-data/child/${childId}`),
};

// Parent API endpoints
export const parentApi = {
    // Get all parents (staff only, filtered by kindergarten)
    getAllParents: () =>
        apiGet<ParentResponseDto[]>("/api/parents"),

    // Get parent by ID
    getParentById: (parentId: string) =>
        apiGet<ParentResponseDto>(`/api/parents/${parentId}`),
};

// Relationship API endpoints
export const relationshipApi = {
    // Get relationships for a child (returns list of parent relationships)
    getRelationshipsByChild: (childId: string) =>
        apiGet<ParentChildDto[]>(`/api/relationships/child/${childId}`),
};

// Calendar API endpoints
export const calendarApi = {
    // Get events for a kindergarten
    getEventsByKindergarten: (kindergartenId: string) =>
        apiGet<CalendarEventResponseDto[]>(`/api/calendar/kindergarten/${kindergartenId}`),

    // Get events by date range
    getEventsByDateRange: (kindergartenId: string, start: string, end: string) =>
        apiGet<CalendarEventResponseDto[]>(
            `/api/calendar/kindergarten/${kindergartenId}/range?start=${start}&end=${end}`
        ),
};
