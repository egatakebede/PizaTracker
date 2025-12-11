package com.campuscare.controller;

import com.campuscare.model.*;
import com.campuscare.util.DataService;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.util.*;
import java.util.stream.Collectors;

public class AnalyticsController {
    @FXML private Label totalRequestsLabel;
    @FXML private Label pendingLabel;
    @FXML private Label inProgressLabel;
    @FXML private Label completedLabel;
    @FXML private Label avgResolutionLabel;
    @FXML private Label completionRateLabel;
    @FXML private TableView<Map.Entry<String, Long>> categoryTable;
    @FXML private TableColumn<Map.Entry<String, Long>, String> categoryCol;
    @FXML private TableColumn<Map.Entry<String, Long>, String> countCol;
    @FXML private TableColumn<Map.Entry<String, Long>, String> percentCol;
    @FXML private TableView<Map.Entry<String, Long>> priorityTable;
    @FXML private TableColumn<Map.Entry<String, Long>, String> priorityCol;
    @FXML private TableColumn<Map.Entry<String, Long>, String> priorityCountCol;
    @FXML private TableColumn<Map.Entry<String, Long>, String> priorityPercentCol;
    
    private DataService dataService;
    private User currentUser;
    
    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }
    
    public void setUser(User user) {
        this.currentUser = user;
        loadAnalytics();
    }
    
    @FXML
    private void initialize() {
        categoryCol.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getKey()));
        countCol.setCellValueFactory(data -> new SimpleStringProperty(String.valueOf(data.getValue().getValue())));
        percentCol.setCellValueFactory(data -> {
            long total = categoryTable.getItems().stream().mapToLong(Map.Entry::getValue).sum();
            double percent = total > 0 ? (data.getValue().getValue() * 100.0 / total) : 0;
            return new SimpleStringProperty(String.format("%.1f%%", percent));
        });
        
        priorityCol.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getKey()));
        priorityCountCol.setCellValueFactory(data -> new SimpleStringProperty(String.valueOf(data.getValue().getValue())));
        priorityPercentCol.setCellValueFactory(data -> {
            long total = priorityTable.getItems().stream().mapToLong(Map.Entry::getValue).sum();
            double percent = total > 0 ? (data.getValue().getValue() * 100.0 / total) : 0;
            return new SimpleStringProperty(String.format("%.1f%%", percent));
        });
    }
    
    private void loadAnalytics() {
        List<ServiceRequest> requests = dataService.getAllRequests();
        
        totalRequestsLabel.setText(String.valueOf(requests.size()));
        pendingLabel.setText(String.valueOf(requests.stream().filter(r -> r.getStatus() == RequestStatus.PENDING).count()));
        inProgressLabel.setText(String.valueOf(requests.stream().filter(r -> r.getStatus() == RequestStatus.IN_PROGRESS).count()));
        completedLabel.setText(String.valueOf(requests.stream().filter(r -> r.getStatus() == RequestStatus.COMPLETED).count()));
        
        long completed = requests.stream().filter(r -> r.getStatus() == RequestStatus.COMPLETED).count();
        double completionRate = requests.isEmpty() ? 0 : (completed * 100.0 / requests.size());
        completionRateLabel.setText(String.format("%.1f%%", completionRate));
        
        double avgHours = requests.stream()
            .filter(r -> r.getResolutionTimeHours() > 0)
            .mapToLong(ServiceRequest::getResolutionTimeHours)
            .average()
            .orElse(0);
        avgResolutionLabel.setText(String.format("%.1fh", avgHours));
        
        Map<String, Long> categoryStats = requests.stream()
            .filter(r -> r.getCategory() != null)
            .collect(Collectors.groupingBy(r -> r.getCategory().toString(), Collectors.counting()));
        categoryTable.setItems(FXCollections.observableArrayList(categoryStats.entrySet()));
        
        Map<String, Long> priorityStats = requests.stream()
            .filter(r -> r.getPriority() != null)
            .collect(Collectors.groupingBy(r -> r.getPriority().toString(), Collectors.counting()));
        priorityTable.setItems(FXCollections.observableArrayList(priorityStats.entrySet()));
    }
    
    @FXML
    private void handleBack() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/campuscare/view/Dashboard.fxml"));
            Stage stage = (Stage) totalRequestsLabel.getScene().getWindow();
            
            Scene scene = new Scene(loader.load());
            scene.getStylesheets().add(getClass().getResource("/com/campuscare/css/styles.css").toExternalForm());
            
            DashboardController controller = loader.getController();
            controller.setDataService(dataService);
            controller.setUser(currentUser);
            
            stage.setScene(scene);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
