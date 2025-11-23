import type { Metadata } from "next";
import { Montserrat, Poppins } from 'next/font/google';
import { SidebarProvider } from "../src/contexts/SidebarContext";
import "./globals.css";
import QueryProvider from "@/src/providers/QueryProvider";
import { AuthProvider } from "@/src/providers/AuthProvider";
import { GenericModalProvider } from "@/src/contexts/GenericModalContext";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OnEnglish Dashboard",
  description: "Dashboard para el sistema de Olimpiadas Bilingües OnEnglish",
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider>
              <GenericModalProvider>{children}</GenericModalProvider>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
