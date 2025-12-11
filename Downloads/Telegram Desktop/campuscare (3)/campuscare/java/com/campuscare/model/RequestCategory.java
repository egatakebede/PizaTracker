package com.campuscare.model;

public enum RequestCategory {
    IT_SUPPORT("IT Support"),
    FACILITIES_MAINTENANCE("Facilities Maintenance"),
    ACADEMIC_ADVISING("Academic Advising"),
    ADMINISTRATIVE_ASSISTANCE("Administrative Assistance");
    
    private final String displayName;
    
    RequestCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
