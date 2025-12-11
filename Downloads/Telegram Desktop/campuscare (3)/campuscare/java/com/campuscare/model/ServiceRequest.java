package com.campuscare.model;

import javafx.beans.property.ObjectProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import java.io.Serializable;

public class ServiceRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String requestId;
    private String title;
    private RequestCategory category;
    private RequestStatus status;
    private Priority priority;
    private String description;
    private String requesterId;
    private String departmentId;
    private String createdAt;
    private String attachmentPath;
    private String assignedTo;
    private String completedAt;
    private java.util.List<String> comments;

    // Backwards-compatible constructor used by older controllers
    public ServiceRequest(String id, String requester, String type, String status) {
        this.requestId = id;
        this.title = type;
        this.requesterId = requester;
        // try parse status string to enum
        try {
            this.status = RequestStatus.valueOf(status.toUpperCase().replace(' ', '_'));
        } catch (Exception e) {
            this.status = RequestStatus.PENDING;
        }
        this.category = null;
        this.priority = Priority.MEDIUM;
        this.description = null;
        this.createdAt = java.time.LocalDateTime.now().toString();
    }

    public ServiceRequest(String requestId, String title, RequestCategory category,
                          RequestStatus status, Priority priority, String description,
                          String requesterId, String departmentId, String createdAt) {
        this.requestId = requestId;
        this.title = title;
        this.category = category;
        this.status = status;
        this.priority = priority;
        this.description = description;
        this.requesterId = requesterId;
        this.departmentId = departmentId;
        this.createdAt = createdAt;
        this.comments = new java.util.ArrayList<>();
    }

    public StringProperty requestIdProperty() { return new SimpleStringProperty(requestId); }
    public StringProperty titleProperty() { return new SimpleStringProperty(title); }
    public ObjectProperty<RequestCategory> categoryProperty() { return new SimpleObjectProperty<>(category); }
    public ObjectProperty<RequestStatus> statusProperty() { return new SimpleObjectProperty<>(status); }
    public ObjectProperty<Priority> priorityProperty() { return new SimpleObjectProperty<>(priority); }
    public StringProperty descriptionProperty() { return new SimpleStringProperty(description); }
    public StringProperty requesterIdProperty() { return new SimpleStringProperty(requesterId); }
    public StringProperty createdAtProperty() { return new SimpleStringProperty(createdAt); }
    
    // Compatibility aliases for older code
    public StringProperty idProperty() { return requestIdProperty(); }
    public StringProperty requesterProperty() { return requesterIdProperty(); }
    public StringProperty typeProperty() { return titleProperty(); }
    public StringProperty statusTextProperty() { return new SimpleStringProperty(status == null ? "" : status.name()); }

    // New getters expected by controllers and DataService
    public String getRequestId() { return requestId; }
    public String getTitle() { return title; }
    public RequestCategory getCategory() { return category; }
    public RequestStatus getStatus() { return status; }
    public Priority getPriority() { return priority; }
    public String getDescription() { return description; }
    public String getRequesterId() { return requesterId; }
    public String getDepartmentId() { return departmentId; }
    public String getCreatedAt() { return createdAt; }

    public String getAttachmentPath() { return attachmentPath; }
    public void setAttachmentPath(String attachmentPath) { this.attachmentPath = attachmentPath; }
    
    public void setStatus(RequestStatus status) { 
        this.status = status;
        if (status == RequestStatus.COMPLETED && completedAt == null) {
            this.completedAt = java.time.LocalDateTime.now().toString();
        }
    }
    
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    
    public String getCompletedAt() { return completedAt; }
    
    public java.util.List<String> getComments() { 
        return comments == null ? new java.util.ArrayList<>() : comments; 
    }
    
    public void addComment(String comment) {
        if (comments == null) comments = new java.util.ArrayList<>();
        comments.add(java.time.LocalDateTime.now() + ": " + comment);
    }
    
    public long getResolutionTimeHours() {
        if (completedAt == null) return -1;
        try {
            java.time.LocalDateTime start = java.time.LocalDateTime.parse(createdAt);
            java.time.LocalDateTime end = java.time.LocalDateTime.parse(completedAt);
            return java.time.Duration.between(start, end).toHours();
        } catch (Exception e) {
            return -1;
        }
    }

    // Backwards-compatible aliases for older code (map to new fields)
    public String getId() { return requestId; }
    public String getRequester() { return requesterId; }
    public String getType() { return title; }
}
