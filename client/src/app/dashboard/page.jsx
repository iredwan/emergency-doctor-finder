"use client";
import { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiCalendar, 
  FiUserPlus, 
  FiPieChart, 
  FiBarChart2, 
  FiActivity, 
  FiUser, 
  FiClock,
  FiCheck,
  FiX,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { 
  getAllDoctors, 
  getAllProfiles, 
  getAllSchedules 
} from "../apiRequest/dashboardApi";
import Link from "next/link";
import moment from "moment";
import { config } from "../../config/config.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalUsers: 0,
    totalSchedules: 0,
    recentUsers: [],
    recentDoctors: [],
    recentSchedules: []
  });
  const [loading, setLoading] = useState(true);
  const baseImageURL = config.uploadURL;

  useEffect(() => {
    // Fetch all required data
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [doctorsData, usersData, schedulesData] = await Promise.all([
          getAllDoctors(),
          getAllProfiles(),
          getAllSchedules()
        ]);
        
        // Process and set the stats
        const statsData = {
          totalDoctors: doctorsData?.length || 0,
          totalUsers: usersData?.length || 0,
          totalSchedules: schedulesData?.length || 0,
          recentDoctors: doctorsData?.slice(0, 5) || [],
          recentUsers: usersData?.slice(0, 5) || [],
          recentSchedules: schedulesData?.slice(0, 5) || []
        };
        
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
      <div className={`rounded-full ${color} p-4 mr-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{loading ? "Loading..." : value}</p>
      </div>
    </div>
  );

  // User/Doctor List Component
  const EntityList = ({ title, entities, type }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : entities.length > 0 ? (
        <div className="space-y-4">
          {entities.map((entity) => (
            <div key={entity._id} className="flex items-center border-b pb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                {entity.img ? (
                  <img 
                    src={`${baseImageURL}${entity.img}`}
                    alt={entity.firstName ? `${entity.firstName} ${entity.lastName}` : entity.name} 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40?text=User";
                    }}
                  />
                ) : entity.image ? (
                  <img 
                    src={`${baseImageURL}${entity.image}`}
                    alt={entity.name} 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40?text=Dr";
                    }}
                  />
                ) : (
                  <FiUser className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">
                  {entity.firstName && entity.lastName 
                    ? `${entity.firstName} ${entity.lastName}`
                    : entity.name || "Unknown Name"}
                </p>
                <p className="text-sm text-gray-500 truncate">{entity.email}</p>
              </div>
              <div className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                {type === "user" 
                  ? entity.role || "User" 
                  : entity.specialty || "Doctor"}
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link href={type === "user" ? "/dashboard/users" : "/dashboard/doctors"} className="text-primary text-sm hover:underline">
              View all {type === "user" ? "users" : "doctors"}
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No {type === "user" ? "users" : "doctors"} found</p>
      )}
    </div>
  );

  // Latest Appointments Component
  const LatestAppointments = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Schedules</h3>
        <Link href="/dashboard/schedules" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : stats.recentSchedules && stats.recentSchedules.length > 0 ? (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentSchedules.map((schedule) => {
                const doctorInfo = stats.recentDoctors.find(d => d._id === schedule.doctorId) || {};
                return (
                  <tr key={schedule._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {doctorInfo.image ? (
                            <img 
                              src={`${baseImageURL}${doctorInfo.image}`}
                              alt={doctorInfo.name} 
                              className="h-8 w-8 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/32?text=Dr";
                              }}
                            />
                          ) : (
                            <span className="text-primary text-xs font-medium">
                              {doctorInfo.name ? doctorInfo.name.split(' ').map(n => n[0]).join('') : 'Dr'}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {doctorInfo.name || "Unknown Doctor"}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {doctorInfo.specialty || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1 flex-wrap">
                        {schedule.availableDays && schedule.availableDays.slice(0, 3).map((day, idx) => (
                          <span 
                            key={idx} 
                            className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {day.substring(0, 3)}
                          </span>
                        ))}
                        {schedule.availableDays && schedule.availableDays.length > 3 && (
                          <span className="inline-block text-xs text-gray-500">
                            +{schedule.availableDays.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1 text-gray-400" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No recent schedules</p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Doctors" 
            value={stats.totalDoctors} 
            icon={FiUserPlus} 
            color="bg-blue-500"
          />
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={FiUsers} 
            color="bg-green-500"
          />
          <StatCard 
            title="Total Schedules" 
            value={stats.totalSchedules} 
            icon={FiCalendar} 
            color="bg-purple-500"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LatestAppointments />
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">System Status</h3>
                <FiActivity className="text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiCheck className="text-green-500" />
                    </div>
                    <span>Database Connection</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiCheck className="text-green-500" />
                    </div>
                    <span>API Services</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Operational</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FiCheck className="text-green-500" />
                    </div>
                    <span>User Authentication</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Secured</span>
                </div>
                <div className="pt-3 text-center text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users & Doctors */}
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EntityList 
            title="Recent Users" 
            entities={stats.recentUsers || []} 
            type="user"
          />
          <EntityList 
            title="Recent Doctors" 
            entities={stats.recentDoctors || []} 
            type="doctor"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 