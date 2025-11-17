"use client";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // La autenticación se maneja con localStorage en el cliente
  return <>{children}</>;
}
