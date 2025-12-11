package com.campuscare.util;

import com.campuscare.model.*;
import java.io.*;
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

public class DataService {
    private static final String USERS_FILE = "data/users.dat";
    private static final String REQUESTS_FILE = "data/requests.dat";
    
    private List<User> users;
    private List<ServiceRequest> requests;
    
    public DataService() {
        loadData();
        // Debug: Print loaded users
        System.out.println("Loaded users: " + users.size());
        for (User u : users) {
            System.out.println("User: " + u.getUsername() + " / " + u.getPassword());
        }
    }
    
    private void loadData() {
        users = loadUsers();
        requests = loadRequests();
        
        if (users.isEmpty()) {
            initializeDefaultUsers();
        }
    }
    
    @SuppressWarnings("unchecked")
    private List<User> loadUsers() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(USERS_FILE))) {
            return (List<User>) ois.readObject();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    @SuppressWarnings("unchecked")
    private List<ServiceRequest> loadRequests() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(REQUESTS_FILE))) {
            return (List<ServiceRequest>) ois.readObject();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    public void saveUsers() {
        new File("data").mkdirs();
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(USERS_FILE))) {
            oos.writeObject(users);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    public void saveRequests() {
        new File("data").mkdirs();
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(REQUESTS_FILE))) {
            oos.writeObject(requests);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    private void initializeDefaultUsers() {
        users.clear();
        users.add(new User("ADMIN001", "admin", "admin123", "admin@campus.edu", UserRole.ADMIN, "Administration"));
        users.add(new User("1892/16", "1892/16", "pass123", "student1892@campus.edu", UserRole.STUDENT, "Computer Science"));
        users.add(new User("1893/16", "1893/16", "pass123", "student1893@campus.edu", UserRole.STUDENT, "Engineering"));
        users.add(new User("LECT001", "lecturer1", "pass123", "lecturer1@campus.edu", UserRole.LECTURER, "Engineering"));
        users.add(new User("STAFF001", "staff1", "pass123", "staff1@campus.edu", UserRole.STAFF, "Finance"));
        users.add(new User("DEPT-IT001", "itstaff", "pass123", "itstaff@campus.edu", UserRole.DEPARTMENT_STAFF, "IT Support"));
        users.add(new User("DEPT-FAC001", "facilitystaff", "pass123", "facilitystaff@campus.edu", UserRole.DEPARTMENT_STAFF, "Facilities Maintenance"));
        saveUsers();
        System.out.println("Initialized " + users.size() + " default users");
    }
    
    public java.util.List<String> getDepartments() {
        return java.util.Arrays.asList(
            "IT Support",
            "Facilities Maintenance", 
            "Academic Advising",
            "Administrative Services",
            "Library Services",
            "Student Affairs"
        );
    }
    
    public User authenticate(String username, String password) {
        return users.stream()
            .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
            .findFirst()
            .orElse(null);
    }
    
    public void addRequest(ServiceRequest request) {
        requests.add(request);
        saveRequests();
    }
    
    public List<ServiceRequest> getAllRequests() {
        return new ArrayList<>(requests);
    }
    
    public List<ServiceRequest> getRequestsByUser(String userId) {
        return requests.stream()
            .filter(r -> r.getRequesterId().equals(userId))
            .collect(Collectors.toList());
    }
    
    public List<ServiceRequest> getRequestsByDepartment(String department) {
        return requests.stream()
            .filter(r -> r.getDepartmentId() != null && r.getDepartmentId().equals(department))
            .collect(Collectors.toList());
    }
    
    public void updateRequest(ServiceRequest request) {
        for (int i = 0; i < requests.size(); i++) {
            if (requests.get(i).getRequestId().equals(request.getRequestId())) {
                requests.set(i, request);
                saveRequests();
                return;
            }
        }
    }
    
    public void deleteRequest(String requestId) {
        requests.removeIf(r -> r.getRequestId().equals(requestId));
        saveRequests();
    }
    
    public void exportToCSV(String filename, List<ServiceRequest> requestsToExport) throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename))) {
            writer.println("Request ID,Title,Category,Status,Priority,Requester,Created At");
            for (ServiceRequest req : requestsToExport) {
                writer.printf("%s,%s,%s,%s,%s,%s,%s%n",
                    req.getRequestId(), req.getTitle(), req.getCategory(),
                    req.getStatus(), req.getPriority(), req.getRequesterId(),
                    req.getCreatedAt());
            }
        }
    }
}
