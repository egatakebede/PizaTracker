package com.campuscare.model;

import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String userId;
    private String username;
    private String password;
    private String email;
    private UserRole role;
    private String department;

    public User(String userId, String username, String password, String email, UserRole role, String department) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.department = department;
    }

    public String getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getEmail() { return email; }
    public UserRole getRole() { return role; }
    public String getDepartment() { return department; }
    
    public void setPassword(String password) { this.password = password; }
}
