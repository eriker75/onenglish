import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt"; // Removed for demo auth simple

// Valid roles in the system
const VALID_ROLES = ["admin", "coordinator", "teacher", "student", "employee"];

// Routes that require admin role only
const ADMIN_ONLY_ROUTES = [
  "/dashboard/schools",
  "/dashboard/challenges",
  "/dashboard/settings",
  "/dashboard/coordinators",
];

// Routes accessible by coordinators and admins
const COORDINATOR_ROUTES = [
  "/dashboard/teachers",
  "/dashboard/students",
  "/dashboard/answers",
  "/dashboard/statistics",
];

// Routes accessible by teachers, coordinators and admins
const TEACHER_ROUTES = [
  "/dashboard/students",
  "/dashboard/answers",
  "/dashboard/statistics",
];

export function proxy(req: NextRequest) {
  // const tokenInfo = getToken({ req }); // Removed for demo auth simple
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

  // const role = (tokenInfo?.role as string | undefined) || null; // Removed for demo auth simple
  // const hasValidRole = role && VALID_ROLES.includes(role); // Removed for demo auth simple

  // If authenticated and trying to go to login, redirect to dashboard if has valid role
  // if (isAuth && isAuthPage) {
  //   if (hasValidRole) {
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
  //   // Allow login page if no valid role to avoid redirect loop
  //   return NextResponse.next();
  // }

  // Protect dashboard: require valid role
  if (isDashboardPage && !isAuthPage) {
    // Verificar si hay usuario en localStorage se hace en el cliente
    // El middleware solo redirige páginas de auth si ya estás autenticado
    return NextResponse.next();
  }

  if (isAuthPage) {
    // Si ya está autenticado y va a login, redirigir a dashboard
    // Esto se maneja en el cliente con useEffect
    return NextResponse.next();
  }

  // ** rest of code here **/

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
