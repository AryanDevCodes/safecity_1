package org.practice.safecity.controller;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.practice.safecity.model.User;
import org.practice.safecity.service.AuthService;
import org.practice.safecity.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final UserService userService;

    // In-memory OTP storage (aadhaarNumber -> OtpWithTimestamp)
    private static final ConcurrentHashMap<String, OtpWithTimestamp> aadhaarOtpMap = new ConcurrentHashMap<>();
    private static final Pattern AADHAAR_PATTERN = Pattern.compile("^[2-9][0-9]{11}$");
    private static final Random OTP_RANDOM = new Random();
    private static final long OTP_VALIDITY_MILLIS = 5 * 60 * 1000; // 5 minutes

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    // Helper class for OTP with timestamp
    private record OtpWithTimestamp(String otp, long timestamp) {
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String jwt = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        // Fetch user details
        User user = userService.getUserByEmail(loginRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        // Frontend expects array for roles
        response.put("roles", java.util.Collections.singletonList("ROLE_" + user.getRole().name()));
        response.put("avatar", null); // No avatar in User model
        response.put("badge", user.getBadgeNumber());
        response.put("aadharVerified", user.getAadhaarNumber() != null); // crude check
        response.put("performanceRating", null); // Not in User model
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        User registeredUser = authService.registerUser(user);
        String jwt = authService.authenticateUser(registeredUser.getEmail(), user.getPassword());
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("id", registeredUser.getId());
        response.put("name", registeredUser.getName());
        response.put("email", registeredUser.getEmail());
        response.put("roles", java.util.Collections.singletonList("ROLE_" + registeredUser.getRole().name()));
        response.put("avatar", null);
        response.put("badge", registeredUser.getBadgeNumber());
        response.put("aadharVerified", registeredUser.getAadhaarNumber() != null);
        response.put("performanceRating", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }

    // Aadhaar-based login endpoint
    @PostMapping("/aadhaar-login")
    public ResponseEntity<?> aadhaarLogin(@RequestBody AadhaarLoginRequest request) {
        User user = userService.getUserByAadhaar(request.getAadhaarNumber());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Aadhaar number");
        }
        String token = authService.generateTokenForUser(user);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("roles", java.util.Collections.singletonList("ROLE_" + user.getRole().name()));
        response.put("avatar", null);
        response.put("badge", user.getBadgeNumber());
        response.put("aadharVerified", user.getAadhaarNumber() != null);
        response.put("performanceRating", null);
        return ResponseEntity.ok(response);
    }

    // Aadhaar OTP request endpoint
    @PostMapping("/aadhaar-login/request-otp")
    public ResponseEntity<?> requestAadhaarOtp(@RequestBody AadhaarLoginRequest request) {
        // Aadhaar format validation
        if (!AADHAAR_PATTERN.matcher(request.getAadhaarNumber()).matches()) {
            return ResponseEntity.badRequest().body("Invalid Aadhaar number format");
        }
        User user = userService.getUserByAadhaar(request.getAadhaarNumber());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Aadhaar number not registered");
        }
        // Generate 6-digit OTP
        String otp = String.format("%06d", OTP_RANDOM.nextInt(1000000));
        aadhaarOtpMap.put(request.getAadhaarNumber(), new OtpWithTimestamp(otp, System.currentTimeMillis()));
        System.out.println("[OTP] Aadhaar: " + request.getAadhaarNumber() + " OTP: " + otp);
        // In production, send OTP via SMS here
        return ResponseEntity.ok("OTP sent to registered mobile (simulated)");
    }

    // Aadhaar OTP verify endpoint
    @PostMapping("/aadhaar-login/verify-otp")
    public ResponseEntity<?> verifyAadhaarOtp(@RequestBody AadhaarOtpVerifyRequest request) {
        // Aadhaar format validation
        if (!AADHAAR_PATTERN.matcher(request.getAadhaarNumber()).matches()) {
            return ResponseEntity.badRequest().body("Invalid Aadhaar number format");
        }
        User user = userService.getUserByAadhaar(request.getAadhaarNumber());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Aadhaar number not registered");
        }
        OtpWithTimestamp record = aadhaarOtpMap.get(request.getAadhaarNumber());
        if (record == null || !record.otp().equals(request.getOtp())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }
        if (System.currentTimeMillis() - record.timestamp() > OTP_VALIDITY_MILLIS) {
            aadhaarOtpMap.remove(request.getAadhaarNumber());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP expired");
        }
        aadhaarOtpMap.remove(request.getAadhaarNumber()); // OTP one-time use
        String token = authService.generateTokenForUser(user);
        return ResponseEntity.ok(new JwtAuthResponse(token));
    }

    // DTO for login request
    @Setter
    @Getter
    public static class LoginRequest {
        private String email;
        private String password;

    }

    // DTO for Aadhaar login
    @Getter
    @Setter
    public static class AadhaarLoginRequest {
        private String aadhaarNumber;
    }

    // DTO for Aadhaar OTP verify
    @Getter
    @Setter
    public static class AadhaarOtpVerifyRequest {
        private String aadhaarNumber;
        private String otp;
    }

    // DTO for JWT Auth Response
    @Getter
    @Setter
    public static class JwtAuthResponse {
        private String token;
        public JwtAuthResponse(String token) {
            this.token = token;
        }
    }
}