"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="lg:pl-64 min-h-screen">
          <main className="p-4">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 