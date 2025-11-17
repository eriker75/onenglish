// Simple session storage using localStorage
import { DemoUser } from "./demo-auth";

const SESSION_KEY = "demo-session";

export function setSession(user: DemoUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function getSession(): DemoUser | null {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
  return null;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
