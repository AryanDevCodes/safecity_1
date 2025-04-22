import React from "react";
import { Link } from "react-router-dom";
import { Map, FileText } from "lucide-react";

const AnonymousDashboard = () => (
  <div>
    <h2 className="text-xl font-bold text-amber-900 mb-4">Welcome to Safe City Portal</h2>
    <p className="mb-6">This portal helps you find safe zones and hotspots in your city. <span className="font-semibold text-orange-700">You can report incidents safely and anonymously—your identity will never be shared or tracked.</span> Please login or sign up to track your own reports or get alerts.</p>
    <div className="flex flex-col space-y-4">
      <Link to="/map" className="flex items-center text-orange-700 hover:underline">
        <Map className="mr-2" /> View Hotspot Areas
      </Link>
      <Link to="/report" className="flex items-center text-orange-700 hover:underline font-semibold">
        <FileText className="mr-2" /> Report Incident Anonymously
      </Link>
    </div>
  </div>
);

export default AnonymousDashboard;
