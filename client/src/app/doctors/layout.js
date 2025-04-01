"use client";
import ProtectedRouteUser from "@/components/ProtectedRouteUser";

export default function DoctorsLayout({ children }) {
  return (
    <ProtectedRouteUser>
          <main>{children}</main>
    </ProtectedRouteUser>
  );
} 