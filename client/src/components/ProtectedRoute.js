"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { ErrorToast } from "@/helper/helper";

// ProtectedRoute HOC for admin-only routes
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = () => {
      const token = Cookies.get("token");
      
      if (!token) {
        router.push("/login");
        return;
      }
      
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role !== "admin") {
          ErrorToast("Access denied");
          router.push("/");
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? children : null;
} 