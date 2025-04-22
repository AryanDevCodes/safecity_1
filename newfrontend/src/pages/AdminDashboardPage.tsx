import { Link } from "react-router-dom";
import { Users, FileText, Settings, BarChart2, Bell, Briefcase, AlertTriangle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { Shield } from "lucide-react";

const adminFeatures = [
  {
    title: "User Management",
    description: "Manage users, roles and permissions",
    icon: <Users className="h-6 w-6 text-amber-600" />,
    link: "/admin/users"
  },
  {
    title: "Reports Overview",
    description: "View and manage incident reports",
    icon: <FileText className="h-6 w-6 text-amber-600" />,
    link: "/admin/reports"
  },
  {
    title: "Cases",
    description: "View and manage cases",
    icon: <Briefcase className="h-6 w-6 text-amber-600" />,
    link: "/admin/cases"
  },
  {
    title: "Incidents",
    description: "Monitor and manage incidents",
    icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    link: "/admin/incidents"
  },
  {
    title: "Analytics",
    description: "View analytics and statistics",
    icon: <BarChart2 className="h-6 w-6 text-amber-600" />,
    link: "/admin/analytics"
  },
  {
    title: "Alerts",
    description: "Manage system alerts",
    icon: <Bell className="h-6 w-6 text-amber-600" />,
    link: "/admin/alerts"
  },
  {
    title: "System Settings",
    description: "Configure system preferences",
    icon: <Settings className="h-6 w-6 text-amber-600" />,
    link: "/admin/settings"
  }
];

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 mr-3">
            <Shield className="h-6 w-6 text-orange-700" />
          </span>
          <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminFeatures.map((card) => (
            <Link to={card.link} key={card.title}>
              <div className="bg-white rounded-lg border border-amber-200 shadow-sm p-6 hover:bg-amber-50 transition-colors flex flex-col h-full justify-between">
                <div className="flex flex-row items-center justify-between pb-2">
                  <span className="text-lg font-medium text-amber-800">{card.title}</span>
                  {card.icon}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-amber-600">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
