package com.campuscare.controller;

import com.campuscare.model.*;
import com.campuscare.util.DataService;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import java.io.File;
import java.time.LocalDateTime;
import java.util.UUID;

public class NewRequestController {
    @FXML private TextField titleField;
    @FXML private TextArea descriptionArea;
    @FXML private ComboBox<String> departmentCombo;
    @FXML private ComboBox<RequestCategory> categoryCombo;
    @FXML private ComboBox<Priority> priorityCombo;
    @FXML private Label attachmentLabel;
    
    private User currentUser;
    private DataService dataService;
    private DashboardController dashboardController;
    private String attachmentPath;
    
    public void setUser(User user) {
        this.currentUser = user;
    }
    
    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }
    
    public void setDashboardController(DashboardController controller) {
        this.dashboardController = controller;
    }
    
    @FXML
    private void initialize() {
        priorityCombo.setItems(FXCollections.observableArrayList(Priority.values()));
        priorityCombo.setValue(Priority.MEDIUM);
    }
    
    public void initializeDepartments() {
        departmentCombo.setItems(FXCollections.observableArrayList(dataService.getDepartments()));
        categoryCombo.setItems(FXCollections.observableArrayList(RequestCategory.values()));
    }
    
    @FXML
    private void handleAttachment() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Select Attachment");
        File file = fileChooser.showOpenDialog(titleField.getScene().getWindow());
        
        if (file != null) {
            attachmentPath = file.getAbsolutePath();
            attachmentLabel.setText("Attached: " + file.getName());
        }
    }
    
    @FXML
    private void handleSubmit() {
        if (titleField.getText().isEmpty() || descriptionArea.getText().isEmpty() || 
            departmentCombo.getValue() == null || categoryCombo.getValue() == null) {
            showAlert("Validation Error", "Please fill all required fields");
            return;
        }
        
        String requestId = "REQ" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        ServiceRequest request = new ServiceRequest(
            requestId,
            titleField.getText(),
            categoryCombo.getValue(),
            RequestStatus.PENDING,
            priorityCombo.getValue(),
            descriptionArea.getText(),
            currentUser.getUserId(),
            departmentCombo.getValue(),
            LocalDateTime.now().toString()
        );
        
        if (attachmentPath != null) {
            request.setAttachmentPath(attachmentPath);
        }
        
        dataService.addRequest(request);
        dashboardController.refresh();
        
        Stage stage = (Stage) titleField.getScene().getWindow();
        stage.close();
    }
    
    @FXML
    private void handleCancel() {
        Stage stage = (Stage) titleField.getScene().getWindow();
        stage.close();
    }
    
    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
