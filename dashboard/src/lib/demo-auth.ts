// Simple demo authentication without NextAuth
export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "coordinator" | "teacher";
  avatar: string;
}

export const DEMO_CREDENTIALS = {
  "admin@example.com": { password: "demo123", role: "admin" as const },
  "coordinator@example.com": { password: "demo123", role: "coordinator" as const },
  "teacher@example.com": { password: "demo123", role: "teacher" as const },
};

export const DEMO_USERS: Record<string, DemoUser> = {
  "admin@example.com": {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  "coordinator@example.com": {
    id: "2",
    email: "coordinator@example.com",
    name: "Coordinator User",
    role: "coordinator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coordinator",
  },
  "teacher@example.com": {
    id: "3",
    email: "teacher@example.com",
    name: "Teacher User",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher",
  },
};

export async function validateDemoLogin(
  email: string,
  password: string
): Promise<DemoUser | null> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const credentials = DEMO_CREDENTIALS[email as keyof typeof DEMO_CREDENTIALS];
  if (!credentials || credentials.password !== password) {
    return null;
  }

  return DEMO_USERS[email] || null;
}
