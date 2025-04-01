"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiUsers, 
  FiUserPlus, 
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { logout } from "@/app/apiRequest/authApi";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: FiHome
    },
    {
      path: "/dashboard/doctors",
      name: "Doctors",
      icon: FiUserPlus
    },
    {
      path: "/dashboard/users",
      name: "Users",
      icon: FiUsers
    },
    {
      path: "/dashboard/schedules",
      name: "Schedules",
      icon: FiCalendar
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 mt-12 rounded-md bg-white shadow-md"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6 text-gray-700" />
          ) : (
            <FiMenu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg z-10 transition-all duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-[80vw] max-w-[280px] md:w-56 lg:w-64`}
      >
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">WebDr.</span>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded">Admin</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="mt-16 lg:mt-3 px-3 md:px-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 md:p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-2 md:mr-3 flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-3 md:p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-2 md:mr-3" />
            <span className="text-sm md:text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar; 