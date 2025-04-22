import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle, Map, FileText } from "lucide-react";

const UserDashboard = () => (
  <div>
    <h2 className="text-xl font-bold text-amber-900 mb-4">Welcome!</h2>
    <p className="mb-6">You can report an incident, view the safety map, or use SOS features from the navigation above.</p>
    <div className="flex flex-col space-y-4">
      <Link to="/" className="flex items-center text-orange-700 hover:underline">
        <Home className="mr-2" /> Home
      </Link>
      <Link to="/emergency" className="flex items-center text-orange-700 hover:underline">
        <AlertCircle className="mr-2" /> Emergency
      </Link>
      <Link to="/map" className="flex items-center text-orange-700 hover:underline">
        <Map className="mr-2" /> Safety Map
      </Link>
      <Link to="/report" className="flex items-center text-orange-700 hover:underline">
        <FileText className="mr-2" /> Report Incident
      </Link>
    </div>
  </div>
);

export default UserDashboard;
