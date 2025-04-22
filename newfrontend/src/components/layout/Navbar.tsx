import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Shield, AlertCircle, Map, Menu, Home, FileText, LogIn, UserPlus,
  BadgeAlert, Users, Settings, BarChart3, ScrollText, ShieldAlert, Briefcase
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from '../auth/UserProfile';

const Navbar = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const baseNavItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5 mr-2" /> },
  ];
  
  const anonymousNavItems = [
    { name: 'Login', path: '/login', icon: <LogIn className="h-5 w-5 mr-2" /> },
    { name: 'Sign Up', path: '/signup', icon: <UserPlus className="h-5 w-5 mr-2" /> },
    { name: 'Hotspot Areas', path: '/map', icon: <Map className="h-5 w-5 mr-2" /> },
    { name: 'Report Incident', path: '/report', icon: <FileText className="h-5 w-5 mr-2" /> },
  ];

  const userNavItems = [
    { name: 'Report Incident', path: '/report', icon: <FileText className="h-5 w-5 mr-2" /> },
    { name: 'Emergency', path: '/emergency', icon: <AlertCircle className="h-5 w-5 mr-2" /> },
    { name: 'Safety Map', path: '/map', icon: <Map className="h-5 w-5 mr-2" /> },
  ];
  
  const officerNavItems = [
    { name: 'Control Room', path: '/officer/dashboard', icon: <Shield className="h-5 w-5 mr-2" /> },
    { name: 'Incident Reports', path: '/officer/incidents', icon: <BadgeAlert className="h-5 w-5 mr-2" /> },
    { name: 'Case Files', path: '/officer/cases', icon: <Briefcase className="h-5 w-5 mr-2" /> },
    { name: 'Reports', path: '/officer/reports', icon: <ScrollText className="h-5 w-5 mr-2" /> },
    { name: 'Safety Map', path: '/map', icon: <Map className="h-5 w-5 mr-2" /> },
    { name: 'Emergency', path: '/emergency', icon: <AlertCircle className="h-5 w-5 mr-2" /> },
    { name: 'Report Incident', path: '/report', icon: <FileText className="h-5 w-5 mr-2" /> }
  ];
  
  const adminNavItems = [
    { name: 'Users', path: '/users', icon: <Users className="h-5 w-5 mr-2" /> },
    { name: 'Reports', path: '/reports', icon: <ScrollText className="h-5 w-5 mr-2" /> },
    { name: 'Case Management', path: '/admin/cases', icon: <Briefcase className="h-5 w-5 mr-2" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5 mr-2" /> },
    { name: 'Incidents', path: '/admin/incidents', icon: <BadgeAlert className="h-5 w-5 mr-2" /> },
    { name: 'Alerts', path: '/admin/alerts', icon: <ShieldAlert className="h-5 w-5 mr-2" /> },
  ];

  let navItems = [...baseNavItems];
  if (isAuthenticated) {
    if (role === 'user') {
      navItems = [...anonymousNavItems];
    } else if (role === 'officer') {
      navItems = [...navItems, ...officerNavItems];
    } else if (role === 'admin') {
      navItems = [...navItems, ...adminNavItems];
    }
  } else {
    navItems = [...anonymousNavItems];
  }

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-orange-50 shadow-sm border-b border-amber-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/1d0c5a0a-0a5c-49a3-baff-b8fff6dbce2a.png" 
                alt="Rakshak Logo" 
                className="h-10 w-10" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-orange-800">Rakshak</span>
                <span className="text-xs text-amber-700">Smart Crime Reporting System</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center transition-colors ${
                  isActiveLink(item.path) 
                    ? 'text-orange-600 font-semibold' 
                    : 'text-amber-800 hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-amber-600 text-amber-700 hover:bg-amber-50"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate('/signup')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            {isAuthenticated ? (
              <div className="mr-4">
                <UserProfile />
              </div>
            ) : (
              <div className="flex items-center space-x-2 mr-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="px-1 text-amber-700"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="px-1 text-amber-700"
                  onClick={() => navigate('/signup')}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-amber-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-orange-50 border-l border-amber-200">
                <div className="flex items-center space-x-2 mb-6 mt-2">
                  <img 
                    src="/lovable-uploads/1d0c5a0a-0a5c-49a3-baff-b8fff6dbce2a.png" 
                    alt="Rakshak Logo" 
                    className="h-8 w-8" 
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-orange-800">Rakshak</span>
                    <span className="text-xs text-amber-700">Smart Crime Reporting System</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center py-2 px-4 rounded-md hover:bg-amber-100 ${
                        isActiveLink(item.path) 
                          ? 'bg-amber-100 text-orange-600 font-semibold' 
                          : 'text-amber-800'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                  
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-2 mt-4">
                      <Button 
                        onClick={() => navigate('/login')}
                        className="justify-start border-amber-600 text-amber-700 hover:bg-amber-50"
                        variant="outline"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                      <Button 
                        onClick={() => navigate('/signup')}
                        className="justify-start bg-orange-600 hover:bg-orange-700"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
