import React, { useState } from 'react';
import CrimeMap from '@/components/map/CrimeMap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';

const CrimeMapPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [incidentType, setIncidentType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Map Component */}
        <div className="h-[calc(100vh-4rem)]">
          <CrimeMap />
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-10 space-y-4">
          <Card className="p-4 shadow-lg w-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Map Controls</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Incident Type</label>
                  <Select value={incidentType} onValueChange={setIncidentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Incidents</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {timeRange === 'custom' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <Button className="w-full" variant="default">
                  Apply Filters
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-4 shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Officers</span>
                <span className="text-sm font-bold text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Incidents</span>
                <span className="text-sm font-bold text-amber-600">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Emergencies</span>
                <span className="text-sm font-bold text-red-600">2</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrimeMapPage;
