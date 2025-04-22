import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Phone, MapPin, Shield, Siren } from 'lucide-react';
import EmergencySOS from '../components/home/EmergencySOS';

const EmergencyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Emergency Assistance</h1>
        
        <div className="max-w-3xl mx-auto grid gap-8">
          {/* Primary Emergency Action */}
          <div className="bg-emergency-50 p-6 rounded-xl border border-emergency-100">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Siren size={48} className="text-emergency-600" />
              <h2 className="text-2xl font-bold text-emergency-700">Immediate Emergency?</h2>
              <p className="text-center text-emergency-700">
                If you're in immediate danger, call emergency services immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button size="lg" className="emergency-button animate-pulse-urgent text-xl h-16">
                <Phone className="mr-2 h-6 w-6" />
                Call 911
              </Button>
              <EmergencySOS />
            </div>
          </div>
          
          {/* Emergency Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Resources</CardTitle>
              <CardDescription>Quick access to important contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mt-1 mr-2 text-police-600" />
                    <div>
                      <h3 className="font-medium">Police Department</h3>
                      <p className="text-sm text-muted-foreground">Non-emergency line</p>
                      <a href="tel:+15551234567" className="text-police-700 font-medium">
                        (555) 123-4567
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mt-1 mr-2 text-emergency-600" />
                    <div>
                      <h3 className="font-medium">Fire Department</h3>
                      <p className="text-sm text-muted-foreground">Non-emergency line</p>
                      <a href="tel:+15557654321" className="text-police-700 font-medium">
                        (555) 765-4321
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mt-1 mr-2 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Medical Services</h3>
                      <p className="text-sm text-muted-foreground">Health advice line</p>
                      <a href="tel:+15558881234" className="text-police-700 font-medium">
                        (555) 888-1234
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 mt-1 mr-2 text-police-600" />
                    <div>
                      <h3 className="font-medium">Community Safety</h3>
                      <p className="text-sm text-muted-foreground">Neighborhood watch</p>
                      <a href="tel:+15559876543" className="text-police-700 font-medium">
                        (555) 987-6543
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Safety Tips</CardTitle>
              <CardDescription>Important information for emergency situations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-emergency-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Stay Calm and Assess</h3>
                    <p className="text-sm text-muted-foreground">
                      Take a deep breath and quickly assess the situation to determine the appropriate response.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-emergency-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Know Your Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Be aware of your surroundings and be ready to provide your exact location to emergency services.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-0.5 text-emergency-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Be Clear and Concise</h3>
                    <p className="text-sm text-muted-foreground">
                      When calling for help, clearly state the nature of the emergency, location, and any injuries.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 mt-0.5 text-emergency-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Follow Instructions</h3>
                    <p className="text-sm text-muted-foreground">
                      Listen carefully to emergency operators and follow their instructions while waiting for help.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Remember: In any life-threatening situation, your safety is the priority. Get to safety first if possible.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
