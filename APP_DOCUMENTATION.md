# Check-Kid App Documentation

---

# Backend

## Overview

**Tech Stack:**
- Java 21 with Spring Boot 4.0.0
- PostgreSQL (dual database architecture)
- Maven build system
- Flyway for database migrations
- Spring Security + JWT authentication
- Google OAuth 2.0 integration

**Base Path:** `/api/*`

---

## Architecture

### Dual Database Setup
| Database | Port | Purpose |
|----------|------|---------|
| Auth DB | 5433 | User credentials and authentication |
| App DB | 5432 | Business logic data |

### Role System
| Role | Description                                                       |
|------|-------------------------------------------------------------------|
| `PARENT` | View own children, check-in/out, view/edit health data            |
| `STAFF` | View all children at kindergarten, manage check-ins, create notes |
| `BOSS` | All Staff permissions + manage staff, system configuration        |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/google` | Google OAuth token verification and login |
| POST | `/auth/complete-registration/{userId}` | Complete registration with role selection |
| GET | `/auth/me` | Get current authenticated user |
| GET | `/auth/users/{id}` | Get user by ID |
| POST | `/auth/accept-tos` | Accept terms of service |

### Children (`/api/children`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/children` | Get all children (filtered by role) |
| GET | `/children/{id}` | Get specific child |
| GET | `/children/parent/{parentId}` | Get children by parent (staff only) |
| GET | `/children/kindergarten/{kindergartenId}` | Get children by kindergarten |
| POST | `/children` | Create new child |
| PUT | `/children/{id}` | Update child |
| DELETE | `/children/{id}` | Delete child |

### Check-In/Out (`/api/checker`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/checker/check-in` | Check child in |
| POST | `/checker/confirm/{checkInId}` | Staff confirms check-in |
| POST | `/checker/check-out` | Check child out |
| GET | `/checker/pending` | Get pending check-ins (staff only) |
| GET | `/checker/active` | Get all active check-ins |
| GET | `/checker/history/{childId}` | Get check-in/out history |
| GET | `/checker/status/{childId}` | Get current status of child |

### Parents (`/api/parents`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/parents` | Get all parents (staff/boss only) |
| GET | `/parents/{id}` | Get parent by ID |
| GET | `/parents/{id}/profile` | Get parent profile with children |

### Staff (`/api/staff`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/staff` | Get staff at user's kindergarten |
| GET | `/staff/{id}` | Get staff by ID |
| GET | `/staff/kindergarten/{kindergartenId}` | Get all staff at kindergarten |
| POST | `/staff/{staffId}/promote` | Promote staff to admin |
| POST | `/staff/{staffId}/demote` | Remove admin privileges |

### Kindergartens (`/api/kindergartens`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kindergartens` | Get all kindergartens (public) |
| GET | `/kindergartens/{id}` | Get specific kindergarten |
| PUT | `/kindergartens/{id}` | Update kindergarten (boss only) |
| DELETE | `/kindergartens/{id}` | Delete kindergarten (boss only) |

### Groups (`/api/groups`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/groups` | Create group |
| GET | `/groups/kindergarten/{kindergartenId}` | Get groups by kindergarten |
| GET | `/groups/{id}` | Get single group |
| PUT | `/groups/{id}` | Update group |
| DELETE | `/groups/{id}` | Delete group |
| POST | `/groups/{groupId}/staff/{staffId}` | Assign staff to group |
| DELETE | `/groups/{groupId}/staff/{staffId}` | Remove staff from group |
| POST | `/groups/{groupId}/children/{childId}` | Assign child to group |
| DELETE | `/groups/{groupId}/children/{childId}` | Remove child from group |
| GET | `/groups/{groupId}/children` | Get children in group |
| GET | `/groups/{groupId}/staff` | Get staff in group |
| GET | `/groups/staff/{staffId}` | Get groups for staff |

### Health Data (`/api/health-data`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health-data/child/{childId}` | Get child's health data |
| POST | `/health-data/child/{childId}` | Create health data |
| PUT | `/health-data/child/{childId}` | Update health data |
| DELETE | `/health-data/child/{childId}` | Delete health data |

### Notes (`/api/notes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create note |
| GET | `/notes/child/{childId}` | Get notes for child |
| GET | `/notes/child/{childId}/range` | Get notes in date range |
| GET | `/notes/kindergarten/{kindergartenId}` | Get kindergarten notes |
| GET | `/notes/kindergarten/{kindergartenId}/range` | Get notes by date range |
| DELETE | `/notes/{id}` | Delete note (boss only) |

### Calendar Events (`/api/calendar`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/calendar` | Create event |
| GET | `/calendar/kindergarten/{kindergartenId}` | Get events by kindergarten |
| GET | `/calendar/kindergarten/{kindergartenId}/range` | Get events with date range |
| GET | `/calendar/{id}` | Get single event |
| PUT | `/calendar/{id}` | Update event |
| DELETE | `/calendar/{id}` | Delete event |
| GET | `/calendar/parent/{kindergartenId}/range` | Get events for parent |

### Absences (`/api/absences`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/absences` | Report absence |
| GET | `/absences/child/{childId}` | Get child's absences |
| GET | `/absences/child/{childId}/range` | Get absences in date range |
| POST | `/absences/{id}/approve` | Approve absence (staff) |
| POST | `/absences/{id}/reject` | Reject absence (staff) |
| DELETE | `/absences/{id}` | Delete absence (boss only) |

---

## Authentication Flow

### 1. Google OAuth Login
```
Frontend                           Backend
   |                                  |
   |-- POST /api/auth/google -------->|
   |   (Google ID token)              |
   |                                  |-- Verify with Google API
   |                                  |
   |<-- JWT + user info --------------|
   |    (or needsRegistration: true)  |
```

### 2. Registration Completion (New Users)
```
Frontend                           Backend
   |                                  |
   |-- POST /api/auth/complete ------>|
   |   registration/{userId}          |
   |   (role selection)               |
   |                                  |-- Create Parent/Staff/Boss profile
   |                                  |-- Boss also creates Kindergarten
   |<-- New JWT with role ------------|
```

### 3. JWT Token Structure
- **Subject:** User email
- **Claims:** role, userId
- **Expiration:** 12 hours (43200000ms)
- **Header:** `Authorization: Bearer <token>`

---

### Database Migrations (Flyway)

**Auth Database** (`db/migration/auth/`)
- V1: Create users table
- V2: Add TOS fields

**App Database** (`db/migration/app/`)
- V1: Create core tables (kindergartens, parents, staff, children, health, check-in-out)
- V2: Create groups tables
- V3: Migrate child-group relationships
- V4: Add staff admin role
- V5: Create child permissions
- V6: Add health data audit
- V7: Create absences, notes, events tables
- V8: Add calendar special occasions

---

## Security

### Features
- Google OAuth 2.0
- JWT-based stateless authentication
- Role-based access control (RBAC)
- CORS protection (localhost:3000, 8081, 8082)
- Audit trail for health data edits and check-in/out
- Staff admin promotion system
- TOS acceptance tracking

### Public Endpoints (No Auth Required)
- `POST /api/auth/google`
- `POST /api/auth/complete-registration/**`
- `GET /api/kindergartens`
- `/error`

### Authorization Checks
| Check | Description |
|-------|-------------|
| `canViewChild()` | Parent: own children only; Staff: kindergarten children |
| `canEditChild()` | Parent/Boss can edit; Staff needs privileges |
| `canCheckIn()` | Parents and staff |
| `canCheckOut()` | Staff only |
| `canViewHealthData()` | Parents and staff at kindergarten |
| `canEditHealthData()` | Parents only |
| `isPrivilegedAt()` | Boss or admin staff |
| `canManageGroups()` | Privileged staff |
| `canAssignStaff()` | Boss only |

---

## Backend Project Structure

```
src/main/java/com/ruby/pro203_exam/
├── config/
│   ├── DatabaseConfig.java          # Dual datasource setup
│   └── SecurityConfig.java          # Spring Security configuration
├── controller/
│   ├── AuthController.java
│   ├── ChildController.java
│   ├── CheckerController.java
│   ├── ParentController.java
│   ├── StaffController.java
│   ├── KindergartenController.java
│   ├── GroupController.java
│   ├── HealthDataController.java
│   ├── NoteController.java
│   ├── CalendarEventController.java
│   └── AbsenceController.java
├── service/
│   ├── AuthService.java
│   ├── JwtService.java
│   ├── GoogleAuthService.java
│   ├── ChildService.java
│   ├── CheckerService.java
│   ├── ParentService.java
│   ├── StaffService.java
│   ├── GroupService.java
│   ├── HealthDataService.java
│   ├── NoteService.java
│   ├── CalendarEventService.java
│   ├── AbsenceService.java
│   └── AuthorizationService.java
├── repository/
│   └── (JPA repositories for all entities)
├── model/
│   ├── auth/
│   │   └── User.java
│   └── app/
│       ├── Kindergarten.java
│       ├── Parent.java
│       ├── Staff.java
│       ├── Child.java
│       ├── HealthData.java
│       ├── CheckInOutLog.java
│       ├── Group.java
│       ├── Absence.java
│       ├── Note.java
│       └── CalendarEvent.java
├── dto/
│   └── (Request/Response DTOs)
├── security/
│   ├── JwtAuthFilter.java
│   └── SecurityUtils.java
└── exception/
    ├── AccessDeniedException.java
    └── GlobalExceptionHandler.java

db/migration/
├── auth/                            # Auth DB migrations (V1-V2)
└── app/                             # App DB migrations (V1-V8)
```

---

## Services Overview

| Service | Responsibility |
|---------|----------------|
| `AuthService` | User authentication, registration, TOS |
| `JwtService` | JWT generation and validation |
| `GoogleAuthService` | Google OAuth token verification |
| `ChildService` | Child CRUD operations |
| `CheckerService` | Check-in/out logic |
| `ParentService` | Parent profile management |
| `StaffService` | Staff management, promotions |
| `GroupService` | Group management, assignments |
| `HealthDataService` | Health data CRUD with audit |
| `NoteService` | Notes/blog management |
| `CalendarEventService` | Calendar event management |
| `AbsenceService` | Absence reporting and approval |
| `AuthorizationService` | Permission checks |

---
---

# Frontend

## Overview

**Tech Stack:**
- React Native 0.81.5
- Expo 54.0.25
- Expo Router 6.0.15 (file-based navigation)
- TypeScript 5.9.2
- AsyncStorage for persistence
- Google OAuth 2.0 (via expo-auth-session)

**Key Libraries:**
- `@marceloterreiro/flash-calendar` - Calendar component
- `@expo/vector-icons` - Ionicons
- `@react-native-community/datetimepicker` - Date/time picker

---

## Frontend Project Structure

```
frontend/
├── app/                              # Expo Router navigation
│   ├── (auth)/                       # Authentication screens
│   │   ├── index.tsx                 # Google login
│   │   ├── registration.tsx          # Role selection + profile
│   │   └── personvern.tsx            # Terms acceptance
│   ├── (tabs)/                       # Parent user screens
│   │   ├── home.tsx                  # Dashboard
│   │   ├── posts.tsx                 # Blog/news feed
│   │   ├── calendar.tsx              # Calendar view
│   │   ├── profile.tsx               # User profile
│   │   └── messages/                 # Messaging
│   ├── (staff)/                      # Staff/Admin screens
│   │   ├── employee-home.tsx         # Staff dashboard
│   │   ├── employee-checkin.tsx      # Confirm check-ins
│   │   ├── employee-children.tsx     # View children
│   │   └── admin/                    # Admin-only screens
│   ├── _layout.tsx                   # Root layout + auth logic
│   └── index.tsx                     # Entry point
├── components/                       # Reusable components
├── hooks/                            # Custom React hooks
├── services/                         # API integration
│   ├── api.ts                        # Fetch utilities
│   ├── authApi.ts                    # Auth endpoints
│   ├── checkerApi.ts                 # Check-in/out
│   ├── staffApi.ts                   # Staff operations
│   └── types/                        # TypeScript interfaces
├── styles/                           # StyleSheet objects
├── constants/                        # App constants
└── assets/                           # Images and static files
```

---

## Screens

### Parent Screens (Tab Navigation)
| Screen | File | Description |
|--------|------|-------------|
| Home | `(tabs)/home.tsx` | Dashboard with check-in status, events |
| Blog | `(tabs)/posts.tsx` | News feed with posts |
| Calendar | `(tabs)/calendar.tsx` | Flash calendar with events |
| Profile | `(tabs)/profile.tsx` | User profile, children, logout |
| Messages | `(tabs)/messages.tsx` | Message thread list |

### Parent Additional Screens
| Screen | File | Description |
|--------|------|-------------|
| Check-in | `checkin.tsx` | Check in/out children |
| Day Summary | `day-summary.tsx` | Daily activity summary |
| Add Child | `add-child.tsx` | Register new child |
| Child Profile | `child/[id].tsx` | View child details |
| Edit Child | `child/edit/[id].tsx` | Edit child info |
| Diaper/Nap | `diaper-nap.tsx` | Track diaper and naps |
| Edit Profile | `edit-profile.tsx` | Edit parent profile |

### Staff Screens (Tab Navigation)
| Screen | File | Description |
|--------|------|-------------|
| Home | `(staff)/employee-home.tsx` | Dashboard with active check-ins |
| Blog | `(staff)/employee-posts.tsx` | Blog management |
| Calendar | `(staff)/employee-calendar.tsx` | Calendar management |
| Profile | `(staff)/employee-profile.tsx` | Staff profile |
| Check-in | `(staff)/employee-checkin.tsx` | Confirm check-ins/outs |
| Children | `(staff)/employee-children.tsx` | View children in groups |

### Admin-Only Screens
| Screen | File | Description |
|--------|------|-------------|
| Administration | `admin/administration.tsx` | Admin control panel |
| Manage Groups | `admin/manage-groups.tsx` | Create/edit groups |
| Manage Staff | `admin/manage-staff.tsx` | Manage staff members |
| Settings | `admin/kindergarten-settings.tsx` | Kindergarten config |

---

## Navigation

**Architecture:** File-based routing with Expo Router

**Route Groups:**
- `(auth)` - Unauthenticated users
- `(tabs)` - Parent users (PARENT role)
- `(staff)` - Staff users (STAFF/BOSS roles)

**Root Layout Logic:**
1. Check AsyncStorage for existing token
2. Validate token with `/api/auth/me`
3. Route based on role:
   - No token → `(auth)`
   - PARENT → `(tabs)/home`
   - STAFF/BOSS → `(staff)/employee-home`

---


### Base URL Configuration
```typescript
// Platform-aware base URL
Android-Emulator
    http://10.0.2.2:8080
    
iOS/Web          
    http://localhost:8080
```


## Authentication Flow

### 1. Google Login
```
User                    Frontend                    Backend
 |                         |                          |
 |-- Tap Login ----------->|                          |
 |                         |-- expo-auth-session ---->|
 |                         |   (Google OAuth)         |
 |                         |<-- ID Token -------------|
 |                         |                          |
 |                         |-- POST /auth/google ---->|
 |                         |<-- JWT + user info ------|
 |                         |                          |
 |                         |-- Store in AsyncStorage  |
 |<-- Navigate to app -----|                          |
```

### 2. New User Registration
```
Frontend                                Backend
   |                                      |
   |-- (needsRegistration: true) -------->|
   |                                      |
   |-- Show role selection screen         |
   |   (PARENT / STAFF / BOSS)            |
   |                                      |
   |-- POST /auth/complete-registration ->|
   |   { role, firstName, lastName, ... } |
   |                                      |
   |<-- New JWT with role ----------------|
   |                                      |
   |-- Show TOS screen                    |
   |-- POST /auth/accept-tos ------------>|
   |                                      |
   |-- Navigate to home ----------------->|
```

### Registration Fields by Role

**PARENT:**
- firstName, lastName
- phoneNumber, address

**STAFF:**
- firstName, lastName
- employeeId, position, phoneNumber

**BOSS:**
- All STAFF fields
- kindergartenName, kindergartenAddress

---
### Frontend user authentication & onboarding flow

**Authentication Process**
- User clicks the start button on startpage.
- Authentication is handeled by Google.
- Conditional routing. Wheter user is new or returning.

**Role-based registration**
- Upon registration, there lays a role to be chosen. Each role with its own access limits.
- Parent collects personal contact information. Prompted to add a child immediately or skip on registration, and instead add it later.
- Employee collects personal information and requires the user to select a specific kindergarten if its created by the manager.
- Boss/manager has admin access.

**RBAC**
- Parent: Overview of their own children, checkin functionality, access to blog, calendar and messages.
- Employee: Ability to confirm child check-ins, access to child profiles, messaging, blog, calendar and activity logging, for ex diaper changes.
- Manager: Full admin access to all platform services, including facility creation, department management and staff assignments.

---

## Styling

**Approach:** React Native StyleSheet + centralized constants

### Color System (`constants/Colors.ts`)
```typescript
Colors = {
  primaryBlue: "#BACEFF",
  primaryLightBlue: "#E8EEFF",
  red: "#FF7C7C",
  yellow: "#F9D74F",
  green: "#78EB7B",
  brown: "#836868",
  background: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  tabBackground: "#FFFFFF",
}
```

### Style Files (`styles/`)
| File | Purpose |
|------|---------|
| `colors.ts` | Color palette |
| `parentCheckinStyles.ts` | Parent check-in screen |
| `employeeHomeStyles.ts` | Staff dashboard |
| `adminStyles.ts` | Admin screens |
| `calendar-styles.ts` | Calendar component |
| `chat.ts` | Messaging styles |
| `dailySummaryStyles.ts` | Day summary screen |

---

## TypeScript Types

Located in `services/types/`:

| File | Types |
|------|-------|
| `auth.ts` | UserResponseDto, LoginResponseDto, RegistrationRole |
| `checker.ts` | CheckInDto, CheckOutDto, CheckerResponseDto, PersonType |
| `staff.ts` | StaffResponseDto, KindergartenResponseDto, GroupResponseDto |
| `health.ts` | HealthDataDto |
| `note.ts` | NoteDto |
| `child.ts` | ChildDto |
| `calendar.ts` | CalendarEventDto |
| `absence.ts` | AbsenceDto |

---

## Configuration

### app.json (Expo)
```json
{
  "name": "check-kid",
  "slug": "check-kid",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "checkkid"
}
```

### Scripts (package.json)
```bash
npm start        # Start Expo dev server
npm run android  # Build for Android
npm run ios      # Build for iOS
npm run web      # Start web mode
npm run lint     # Run ESLint
```

---

## Key Features

### Parent Features
- View children's check-in status
- Check in/out children
- View calendar events
- Read blog posts
- Manage child profiles
- Daily summaries of their child's day

### Staff Features
- Confirm check-ins/outs
- View all children at kindergarten
- Create blog posts
- Manage calendar events
- Log diaper changes and naps

### Admin Features (Boss + Admin Staff)
- Manage groups (create, edit, delete)
- Assign staff to groups
- Assign children to groups
- Promote/demote staff admins
- Edit kindergarten settings
