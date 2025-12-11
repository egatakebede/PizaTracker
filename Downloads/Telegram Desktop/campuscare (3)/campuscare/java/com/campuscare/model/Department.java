package com.campuscare.model;

import java.io.Serializable;

public class Department implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String departmentId;
    private String name;
    private String description;

    public Department(String departmentId, String name, String description) {
        this.departmentId = departmentId;
        this.name = name;
        this.description = description;
    }

    public String getDepartmentId() { return departmentId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    
    @Override
    public String toString() { return name; }
}
