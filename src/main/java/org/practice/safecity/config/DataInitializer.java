package org.practice.safecity.config;

import org.practice.safecity.model.*;
import org.practice.safecity.model.enums.CasePriority;
import org.practice.safecity.model.enums.CaseStatus;
import org.practice.safecity.model.enums.ReportStatus;
import org.practice.safecity.model.enums.UserRole;
import org.practice.safecity.repository.CaseRepository;
import org.practice.safecity.repository.IncidentRepository;
import org.practice.safecity.repository.ReportRepository;
import org.practice.safecity.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

//@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      CaseRepository caseRepository,
                                      IncidentRepository incidentRepository,
                                      ReportRepository reportRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("[DataInitializer] Running data initialization...");
            // Users
            if (!userRepository.existsByEmail("admin@safecity.com")) {
                System.out.println("[DataInitializer] Inserting admin user");
                userRepository.save(new User(null, "Admin", "admin@safecity.com", passwordEncoder.encode("admin123"), "123456789012", UserRole.ADMIN, "ADM001", LocalDateTime.now(), LocalDateTime.now()));
            }
            if (!userRepository.existsByEmail("officer@safecity.com")) {
                System.out.println("[DataInitializer] Inserting officer user");
                userRepository.save(new User(null, "Officer", "officer@safecity.com", passwordEncoder.encode("officer123"), "123456789013", UserRole.OFFICER, "OFF001", LocalDateTime.now(), LocalDateTime.now()));
            }
            if (!userRepository.existsByEmail("user@safecity.com")) {
                System.out.println("[DataInitializer] Inserting regular user");
                userRepository.save(new User(null, "Regular User", "user@safecity.com", passwordEncoder.encode("user123"), "123456789014", UserRole.USER, null, LocalDateTime.now(), LocalDateTime.now()));
            }
            if (!userRepository.existsByEmail("guest@safecity.com")) {
                System.out.println("[DataInitializer] Inserting guest user");
                userRepository.save(new User(null, "Guest", "guest@safecity.com", passwordEncoder.encode("guest123"), "123456789015", UserRole.USER, null, LocalDateTime.now(), LocalDateTime.now()));
            }

            // Insert 50 users
            for (int i = 1; i <= 50; i++) {
                String email = "testuser" + i + "@safecity.com";
                if (!userRepository.existsByEmail(email)) {
                    String aadhaar = String.format("9000000000%02d", i); // e.g. 900000000001, 900000000002
                    userRepository.save(new User(null, "Test User " + i, email, passwordEncoder.encode("test1234"), aadhaar, UserRole.USER, null, LocalDateTime.now(), LocalDateTime.now()));
                }
            }

            // Cases
            if (caseRepository.count() == 0) {
                System.out.println("[DataInitializer] Inserting cases");
                CaseNote note1 = new CaseNote(null, "Initial investigation started.", "admin@safecity.com", LocalDateTime.now());
                CaseNote note2 = new CaseNote(null, "Suspect identified.", "officer@safecity.com", LocalDateTime.now());
                caseRepository.save(new Case(null, "CASE001", "Robbery at Market", "A robbery occurred at the city market.", CaseStatus.NEW, CasePriority.HIGH, "Market Street", "Central District", "officer@safecity.com", Arrays.asList(note1, note2), LocalDateTime.now(), LocalDateTime.now()));
                caseRepository.save(new Case(null, "CASE002", "Vandalism in Park", "Graffiti found in city park.", CaseStatus.IN_PROGRESS, CasePriority.MEDIUM, "City Park", "North District", "officer@safecity.com", List.of(), LocalDateTime.now(), LocalDateTime.now()));
                caseRepository.save(new Case(null, "CASE003", "Burglary in Flat", "Burglary reported in residential flat.", CaseStatus.RESOLVED, CasePriority.LOW, "Green Apartments", "East District", "officer@safecity.com", List.of(), LocalDateTime.now(), LocalDateTime.now()));
            }

            // Insert 50 cases
            if (caseRepository.count() < 50) {
                for (int i = 1; i <= 50; i++) {
                    caseRepository.save(new Case(null, "CASE" + String.format("%03d", i+10), "Case Title " + i, "Description for case " + i, CaseStatus.NEW, CasePriority.MEDIUM, "Location " + i, "District " + i, "officer@safecity.com", List.of(), LocalDateTime.now(), LocalDateTime.now()));
                }
            }

            // Incidents
            if (incidentRepository.count() == 0) {
                System.out.println("[DataInitializer] Inserting incidents");
                incidentRepository.save(new Incident(null, "INC001", "Assault Reported", "Physical altercation between two individuals.", "Assault", "High", "Downtown", "Open", LocalDateTime.now(), LocalDateTime.now()));
                incidentRepository.save(new Incident(null, "INC002", "Noise Complaint", "Loud music reported late at night.", "Noise", "Low", "Suburb Area", "Closed", LocalDateTime.now(), LocalDateTime.now()));
                incidentRepository.save(new Incident(null, "INC003", "Fire Alarm", "Fire alarm triggered in office building.", "Fire", "Critical", "Business Center", "Resolved", LocalDateTime.now(), LocalDateTime.now()));
            }

            // Insert 50 incidents
            if (incidentRepository.count() < 50) {
                for (int i = 1; i <= 50; i++) {
                    incidentRepository.save(new Incident(null, "INC" + String.format("%03d", i+10), "Incident Title " + i, "Description for incident " + i, "Type" + i, "Medium", "Location " + i, "Open", LocalDateTime.now(), LocalDateTime.now()));
                }
            }

            // Reports
//            if (reportRepository.count() == 0) {
//                System.out.println("[DataInitializer] Inserting reports");
//                reportRepository.save(new Report(null, "REP001", "Crime", "Report of theft at bus stop.", ReportStatus.NEW, "Bus Stop", "user@safecity.com", LocalDateTime.now(), LocalDateTime.now()));
//                reportRepository.save(new Report(null, "REP002", "Maintenance", "Broken streetlight reported.", ReportStatus.APPROVED, "Main Road", "user@safecity.com", LocalDateTime.now(), LocalDateTime.now()));
//                reportRepository.save(new Report(null, "REP003", "Accident", "Minor accident at intersection.", ReportStatus.NEW, "5th Avenue", "officer@safecity.com", LocalDateTime.now(), LocalDateTime.now()));
//            }

            // Insert 50 reports
//            if (reportRepository.count() < 50) {
//                for (int i = 1; i <= 50; i++) {
//                    reportRepository.save(new Report(null, "REP" + String.format("%03d", i+10), "Type" + i, "Description for report " + i, ReportStatus.NEW, "Location " + i, "user@safecity.com", LocalDateTime.now(), LocalDateTime.now()));
//                }
//            }
            System.out.println("[DataInitializer] Data initialization complete.");
        };
    }
}
