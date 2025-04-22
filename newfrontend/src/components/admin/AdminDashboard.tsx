import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Shield, Users, FileText, Settings, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const dashboardCards = [
    {
      title: "User Management",
      description: "Manage users, roles and permissions",
      icon: <Users className="h-6 w-6 text-amber-600" />,
      link: "/users"
    },
    {
      title: "Reports Overview",
      description: "View and manage incident reports",
      icon: <FileText className="h-6 w-6 text-amber-600" />,
      link: "/reports"
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: <Settings className="h-6 w-6 text-amber-600" />,
      link: "/settings"
    },
    {
      title: "Active Alerts",
      description: "Monitor and manage alerts",
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      link: "/alerts"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-amber-700" />
        <h2 className="text-2xl font-semibold text-amber-900">Admin Control Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {dashboardCards.map((card) => (
          <Link to={card.link} key={card.title}>
            <Card className="hover:bg-amber-50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-amber-800">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-600">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
