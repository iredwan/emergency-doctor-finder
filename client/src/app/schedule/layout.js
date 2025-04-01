"use client";
import ProtectedRouteUser from "@/components/ProtectedRouteUser";

export default function ScheduleLayout({ children }) {
  return (
    <ProtectedRouteUser>
          <main>{children}</main>
    </ProtectedRouteUser>
  );
} 