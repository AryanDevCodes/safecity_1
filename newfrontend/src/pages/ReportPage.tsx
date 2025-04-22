import React from 'react';
import Navbar from '../components/layout/Navbar';
import ReportForm from '../components/report/ReportForm';
import { FileText } from 'lucide-react';

const ReportPage = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Report Incident</h1>
          <p className="text-orange-700 font-semibold mb-4">
            You can report incidents safely and anonymously. <br />
            <span className="text-sm text-amber-800">Your identity will never be shared or tracked. Only provide your contact details if you want to be reached for follow-up.</span>
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="h-10 w-10 text-orange-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Report an Incident</h1>
            <p className="text-amber-800 max-w-2xl mx-auto">
              Help keep your city safe by reporting incidents in your area. Your information will be kept confidential and our officers will contact you soon.
            </p>
          </div>
          <ReportForm />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
