package com.oms.oms_backend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static class OtpEntry {
        String otp;
        LocalDateTime expiry;

        OtpEntry(String otp) {
            this.otp = otp;
            this.expiry = LocalDateTime.now().plusMinutes(5);
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expiry);
        }
    }

    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpStorage.put(email, new OtpEntry(otp));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = otpStorage.get(email);
        if (entry == null || entry.isExpired()) return false;
        return otp.equals(entry.otp);
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}