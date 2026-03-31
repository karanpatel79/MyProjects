package com.oms.oms_backend.controller;

import com.oms.oms_backend.entity.User;
import com.oms.oms_backend.service.EmailService;
import com.oms.oms_backend.service.OtpService;
import com.oms.oms_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.register(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            User user = userService.login(email, password);
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "blocked", user.isBlocked()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {
        try {
            String email = req.get("email");
            if (isBlank(email)) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            String otp = otpService.generateOtp(email);
            emailService.sendOtp(email, otp);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending OTP");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");
        if (isBlank(email) || isBlank(otp)) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }
        if (otpService.verifyOtp(email, otp)) {
            return ResponseEntity.ok("OTP verified");
        }
        return ResponseEntity.badRequest().body("Invalid or expired OTP");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        try {
            String email = req.get("email");
            String otp = req.get("otp");
            String password = req.get("password");
            if (isBlank(email) || isBlank(otp) || isBlank(password)) {
                return ResponseEntity.badRequest().body("Email, OTP and password are required");
            }
            if (!otpService.verifyOtp(email, otp)) {
                return ResponseEntity.badRequest().body("OTP not verified");
            }
            userService.updatePassword(email, password);
            otpService.clearOtp(email);
            return ResponseEntity.ok("Password reset successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
