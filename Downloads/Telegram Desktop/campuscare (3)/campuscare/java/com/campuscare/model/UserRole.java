package com.campuscare.model;

public enum UserRole {
    STUDENT,           // Submits requests, tracks status, receives updates
    LECTURER,          // Submits requests, tracks status, may review academic-related requests
    STAFF,             // Submits requests, tracks status, manages administrative requests
    DEPARTMENT_STAFF,  // Views department requests, updates status, communicates with requesters
    ADMIN              // Manages users, departments, categories, monitors system
}
