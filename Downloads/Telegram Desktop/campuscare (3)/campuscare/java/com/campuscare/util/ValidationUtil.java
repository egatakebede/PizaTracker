package com.campuscare.util;

public class ValidationUtil {
    
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    public static boolean isNotEmpty(String text) {
        return text != null && !text.trim().isEmpty();
    }
    
    public static boolean isValidPhone(String phone) {
        return phone != null && phone.matches("^[0-9]{10,15}$");
    }
}
