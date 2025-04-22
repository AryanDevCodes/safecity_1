import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import IncidentMap from '../components/map/IncidentMap';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileDown, Info, AlertTriangle, Plus, BarChart, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MapPage = () => {
  const { toast } = useToast();
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  const generateMarkdown = () => {
    toast({
      title: "Generating Markdown",
      description: "Creating your SafeCity project documentation."
    });
    
    const markdownContent = `# SafeCity Project Structure

## Project Overview
The SafeCity application is an integrated crime reporting and management system with a React frontend and Spring Boot backend using MongoDB as the NoSQL database.

## Project Structure
\`\`\`
safecity-application/
├── frontend/                        # React frontend (current code)
│   └── ... (existing React files)
│
└── backend/                         # Spring Boot backend
    ├── src/
    │   ├── main/
    │   │   ├── java/com/safecity/
    │   │   │   ├── SafeCityApplication.java     # Main application class
    │   │   │   │
    │   │   │   ├── controller/                  # REST API controllers
    │   │   │   │   ├── AuthController.java      # Authentication endpoints
    │   │   │   │   ├── IncidentController.java  # Incident management
    │   │   │   │   ├── ReportController.java    # Report submission/management
    │   │   │   │   ├── UserController.java      # User profile management
    │   │   │   │   ├── EmergencyController.java # Emergency alerts
    │   │   │   │   ├── StatisticsController.java # Crime statistics 
    │   │   │   │   └── LocationController.java  # Geolocation data
    │   │   │   │
    │   │   │   ├── model/                       # MongoDB document models
    │   │   │   │   ├── User.java                # User document
    │   │   │   │   ├── Incident.java            # Incident document
    │   │   │   │   ├── Report.java              # Report document
    │   │   │   │   ├── Emergency.java           # Emergency alert document
    │   │   │   │   ├── Location.java            # GeoJSON location document
    │   │   │   │   ├── Evidence.java            # Evidence document (photos, files)
    │   │   │   │   └── audit/                   # Auditing models
    │   │   │   │       └── AuditableDocument.java # Base class with audit fields
    │   │   │   │
    │   │   │   ├── repository/                  # MongoDB repositories
    │   │   │   │   ├── UserRepository.java
    │   │   │   │   ├── IncidentRepository.java
    │   │   │   │   ├── ReportRepository.java
    │   │   │   │   ├── EmergencyRepository.java
    │   │   │   │   └── LocationRepository.java
    │   │   │   │
    │   │   │   ├── service/                     # Business logic layer
    │   │   │   │   ├── AuthService.java         # Authentication service
    │   │   │   │   ├── IncidentService.java     # Incident management
    │   │   │   │   ├── ReportService.java       # Report processing
    │   │   │   │   ├── UserService.java         # User management
    │   │   │   │   ├── EmergencyService.java    # Emergency handling
    │   │   │   │   ├── StatisticsService.java   # Analytics services
    │   │   │   │   ├── NotificationService.java # Notification sending
    │   │   │   │   └── FileStorageService.java  # Evidence file handling
    │   │   │   │
    │   │   │   ├── dto/                         # Data Transfer Objects
    │   │   │   │   ├── request/                 # Request DTOs
    │   │   │   │   │   ├── AuthRequest.java     # Login/registration requests
    │   │   │   │   │   ├── IncidentRequest.java # Incident creation requests
    │   │   │   │   │   └── ReportRequest.java   # Report submission requests
    │   │   │   │   │
    │   │   │   │   └── response/                # Response DTOs
    │   │   │   │       ├── AuthResponse.java    # Auth tokens responses
    │   │   │   │       ├── IncidentResponse.java # Incident data responses
    │   │   │   │       ├── ErrorResponse.java   # Standard error responses
    │   │   │   │       └── StatsResponse.java   # Statistics responses
    │   │   │   │
    │   │   │   ├── security/                    # Security configuration
    │   │   │   │   ├── JwtTokenProvider.java    # JWT generation/validation
    │   │   │   │   ├── UserDetailsServiceImpl.java # Custom user details
    │   │   │   │   ├── SecurityConfig.java      # Security configuration
    │   │   │   │   └── JwtAuthenticationFilter.java # JWT filter
    │   │   │   │
    │   │   │   ├── config/                      # Application configurations
    │   │   │   │   ├── MongoConfig.java         # MongoDB configuration
    │   │   │   │   ├── WebMvcConfig.java        # CORS configuration
    │   │   │   │   ├── SwaggerConfig.java       # API documentation
    │   │   │   │   └── AsyncConfig.java         # Async task configuration
    │   │   │   │
    │   │   │   ├── exception/                   # Exception handling
    │   │   │   │   ├── GlobalExceptionHandler.java # Central exception handler
    │   │   │   │   ├── ResourceNotFoundException.java
    │   │   │   │   ├── UnauthorizedException.java
    │   │   │   │   └── BadRequestException.java
    │   │   │   │
    │   │   │   └── util/                        # Utility classes
    │   │   │       ├── GeoJsonUtil.java         # GeoJSON helpers
    │   │   │       └── DateTimeUtil.java        # Date/time utilities
    │   │   │
    │   │   └── resources/
    │   │       ├── application.yml              # Main configuration
    │   │       ├── application-dev.yml          # Dev environment config
    │   │       ├── application-prod.yml         # Production config
    │   │       └── logback-spring.xml           # Logging configuration
    │   │
    │   └── test/                                # Unit and integration tests
    │       └── java/com/safecity/
    │           ├── controller/                  # Controller tests
    │           ├── service/                     # Service tests
    │           └── repository/                  # Repository tests
    │
    ├── pom.xml                                  # Maven dependencies
    └── Dockerfile                               # Docker configuration
\`\`\`

## MongoDB Document Models

### User Document:
\`\`\`java
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password; // Hashed password
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Set<String> roles; // ROLE_USER, ROLE_OFFICER, ROLE_ADMIN
    private String badgeNumber; // For officers
    private String precinct; // For officers
    private Date createdAt;
    private Date updatedAt;
    private boolean enabled;
    // getters and setters
}
\`\`\`

### Incident Document:
\`\`\`java
@Document(collection = "incidents")
public class Incident {
    @Id
    private String id;
    private String type; // Theft, Assault, etc.
    private String description;
    private GeoJsonPoint location; // MongoDB GeoJSON Point type
    private String status; // Active, Investigating, Resolved
    private String reportedBy; // User ID
    private String assignedTo; // Officer ID
    private List<String> evidenceIds; // References to Evidence documents
    private Date incidentDate; // When the incident occurred
    private Date reportedDate; // When it was reported
    private Date resolvedDate; // When it was resolved
    private Boolean isEmergency;
    private Integer severity; // 1-5 scale
    // getters and setters
}
\`\`\`

### GeoJSON Location:
\`\`\`java
public class GeoJsonPoint {
    private String type = "Point";
    private List<Double> coordinates; // [longitude, latitude]
    // getters and setters
}
\`\`\`

## MongoDB Configuration
\`\`\`yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/safecity
      auto-index-creation: true

  # For file uploads
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# JWT Configuration
jwt:
  secret: your-secret-key-here
  expiration: 86400000 # 24 hours in milliseconds
\`\`\`

## MongoDB Repository Example
\`\`\`java
public interface IncidentRepository extends MongoRepository<Incident, String> {
    // Find incidents within a certain radius (in meters) from a point
    List<Incident> findByLocationNear(Point location, Distance distance);
    
    // Find by type and status
    List<Incident> findByTypeAndStatus(String type, String status);
    
    // Find incidents reported by a user
    List<Incident> findByReportedBy(String userId);
    
    // Find incidents assigned to an officer
    List<Incident> findByAssignedTo(String officerId);
    
    // Count active incidents by type
    @Query("{'status': 'active', 'type': ?0}")
    Long countActiveIncidentsByType(String type);
}
\`\`\`

## MongoDB Benefits for SafeCity
- **Geospatial Indexing**: Store incident locations as GeoJSON points, query incidents by proximity to user's location, create heat maps using efficient geospatial aggregation
- **Flexible Schema**: Different incident types can have different attributes, easy addition of new fields without schema migrations, better handling of nested objects
- **GridFS for Evidence Storage**: Store large files like photos and videos within MongoDB, link them directly to incident reports, stream files efficiently to frontend
- **Efficient Read Operations**: Embedded documents reduce join operations, denormalized data improves read performance

## Frontend Integration
\`\`\`typescript
// src/services/incidentService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchIncidents = async (lat, lng, radius = 5000) => {
  const response = await axios.get(\`\${API_URL}/incidents/nearby\`, {
    params: { lat, lng, radius },
    headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
  });
  return response.data;
};

export const reportIncident = async (incidentData) => {
  const response = await axios.post(\`\${API_URL}/incidents\`, incidentData, {
    headers: { 
      Authorization: \`Bearer \${localStorage.getItem('token')}\`,
      'Content-Type': 'multipart/form-data' // For file uploads
    }
  });
  return response.data;
};
\`\`\`

## Deployment Architecture
**Containerized Deployment:**
\`\`\`
docker-compose.yml
    - frontend (React container)
    - backend (Spring Boot container)
    - mongodb (MongoDB container)
    - mongo-express (Optional admin UI)
\`\`\`

**Production Deployment:**
- Kubernetes cluster with separate pods for frontend, backend, MongoDB
- MongoDB Atlas for managed database service
- Cloud storage integration for evidence files (optional)

*Document generated from SafeCity project documentation - ${new Date().toLocaleDateString()}*
`;

    // Create a blob from the markdown content
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SafeCity-Project-Structure.md';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Markdown Generated Successfully",
      description: "Your documentation has been downloaded as a .md file.",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Crime Incident Map</h1>
            <p className="text-muted-foreground mt-1">
              View and analyze crime incidents in your area
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setShowProjectInfo(!showProjectInfo)}>
              <Info className="h-4 w-4" />
              {showProjectInfo ? "Hide Info" : "Project Info"}
            </Button>
            
            <Button variant="secondary" onClick={() => {
              toast({
                title: "Report Incident",
                description: "Redirecting to incident reporting form"
              });
            }} className="gap-2">
              <Plus className="h-4 w-4" />
              Report Incident
            </Button>
            
            {showProjectInfo && (
              <Button onClick={generateMarkdown} variant="secondary" className="gap-2">
                <FileDown className="h-4 w-4" />
                Download as Markdown
              </Button>
            )}
          </div>
        </div>
        
        {showProjectInfo && (
          <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-police-700">SafeCity Project Structure</CardTitle>
              <CardDescription>
                An overview of the SafeCity application architecture and components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="architecture">Architecture</TabsTrigger>
                  <TabsTrigger value="data">Data Model</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-4">
                  <div className="space-y-4">
                    <p>
                      The SafeCity application is an integrated crime reporting and management system with a React frontend 
                      and Spring Boot backend using MongoDB as the NoSQL database.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          <AlertTriangle className="h-5 w-5 text-emergency-500" />
                          <h3>Incident Reporting</h3>
                        </div>
                        <p className="text-sm">Submit and track crime incidents with location data and evidence</p>
                      </div>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          <BarChart className="h-5 w-5 text-police-600" />
                          <h3>Crime Analytics</h3>
                        </div>
                        <p className="text-sm">Analyze crime patterns and trends through visual dashboards</p>
                      </div>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                          <Calendar className="h-5 w-5 text-police-600" />
                          <h3>Real-time Updates</h3>
                        </div>
                        <p className="text-sm">Receive notifications about incidents in your neighborhood</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="architecture" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Application Architecture</h3>
                    <p>
                      The SafeCity application follows a modern microservices architecture with a React frontend 
                      and a Spring Boot backend that leverages MongoDB for data storage.
                    </p>
                    
                    <h4 className="font-semibold mt-4">Key Components:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>React frontend with TailwindCSS and shadcn/ui components</li>
                      <li>Spring Boot backend with RESTful APIs</li>
                      <li>MongoDB for flexible document storage</li>
                      <li>JWT authentication for secure access</li>
                      <li>Geospatial indexing for location-based queries</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="data" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">MongoDB Document Models</h3>
                    <p>
                      The application uses MongoDB's document model for flexible schema design and geospatial capabilities.
                    </p>
                    
                    <h4 className="font-semibold mt-4">Key Collections:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>incidents</strong> - Crime incidents with location data</li>
                      <li><strong>users</strong> - User accounts and profiles</li>
                      <li><strong>evidence</strong> - Photos and files related to incidents</li>
                      <li><strong>reports</strong> - Detailed incident reports</li>
                    </ul>
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Download the full documentation to see complete data models and API specifications.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        <IncidentMap />
      </div>
    </div>
  );
};

export default MapPage;
