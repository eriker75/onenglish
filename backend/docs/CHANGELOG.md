# Changelog

## [Unreleased]

### Added - 2025-11-04

#### Roles field in authentication responses
- Added `roles` field to login and register endpoint responses
- Roles are returned as a comma-separated string (e.g., "admin,coordinator")
- Roles are sorted by hierarchy: admin > coordinator > teacher > employee > student
- Frontend can split by "," delimiter and take the first element for the highest priority role

**Changes made:**
1. Modified `AuthService.login()` method:
   - Added include clause to fetch user roles from database
   - Implemented role hierarchy sorting
   - Format roles as comma-separated string

2. Modified `AuthService.register()` method:
   - Added include clause to fetch user roles from database
   - Implemented role hierarchy sorting
   - Format roles as comma-separated string

3. Updated Swagger documentation:
   - Updated `/auth/login` response example to include `roles` field
   - Updated `/auth/register` response example to include `roles` field

**Example response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "3aed95ba-3bfd-4343-bad0-932b121e5de5",
    "email": "user4@example.com",
    "username": "john_doe224",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": null,
    "bio": "I love learning English!",
    "isOnline": true,
    "isActive": true,
    "isVerified": false,
    "roles": "admin,coordinator",
    "lastLoginAt": "2025-11-03T21:01:39.552Z",
    "emailVerifiedAt": null,
    "createdAt": "2025-11-03T20:55:24.465Z",
    "updatedAt": "2025-11-03T21:01:39.554Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "refreshExpiresIn": 604800
}
```

**Files modified:**
- `src/auth/services/auth.service.ts`
- `src/auth/auth.controller.ts`
