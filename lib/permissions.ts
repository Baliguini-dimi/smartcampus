export type Role = "super_admin" | "admin" | "professor" | "student" | "parent";
export type Action = "create" | "read" | "update" | "delete";
export type Resource =
  | "students" | "professors" | "courses" | "enrollments" | "grades"
  | "attendance" | "schedules" | "messages" | "announcements"
  | "ai" | "finance" | "gamification" | "tenant_settings" | "super_admin_panel";

const PERMISSIONS: Record<Role, Partial<Record<Resource, Action[]>>> = {
  super_admin: {
    super_admin_panel: ["create", "read", "update", "delete"],
    tenant_settings: ["create", "read", "update", "delete"],
  },
  admin: {
    students: ["create", "read", "update", "delete"],
    professors: ["create", "read", "update", "delete"],
    courses: ["create", "read", "update", "delete"],
    enrollments: ["create", "read", "update", "delete"],
    grades: ["read", "update"],
    attendance: ["read", "update"],
    schedules: ["create", "read", "update", "delete"],
    messages: ["create", "read"],
    announcements: ["create", "read", "update", "delete"],
    ai: ["read"],
    finance: ["create", "read", "update"],
    gamification: ["read", "update"],
    tenant_settings: ["read", "update"],
  },
  professor: {
    students: ["read"],
    courses: ["read"],
    grades: ["create", "read", "update"],
    attendance: ["create", "read", "update"],
    schedules: ["read"],
    messages: ["create", "read"],
    announcements: ["create", "read"],
    ai: ["create", "read"],
  },
  student: {
    courses: ["read"],
    grades: ["read"],
    attendance: ["read"],
    schedules: ["read"],
    messages: ["create", "read"],
    announcements: ["read"],
    ai: ["create", "read"],
    gamification: ["read"],
  },
  parent: {
    grades: ["read"],
    attendance: ["read"],
    finance: ["read"],
    announcements: ["read"],
  },
};

/** Verifie si un role a le droit d'effectuer une action sur une ressource. */
export function can(role: Role, action: Action, resource: Resource): boolean {
  return PERMISSIONS[role]?.[resource]?.includes(action) ?? false;
}
