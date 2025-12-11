package com.campuscare.controller;

import com.campuscare.model.User;
import com.campuscare.util.DataService;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;

public class ProfileController {
    @FXML private Label idLabel;
    @FXML private Label usernameLabel;
    @FXML private TextField emailField;
    @FXML private Label roleLabel;
    @FXML private Label departmentLabel;
    @FXML private PasswordField currentPasswordField;
    @FXML private PasswordField newPasswordField;
    @FXML private PasswordField confirmPasswordField;
    @FXML private Label messageLabel;
    @FXML private Button fullscreenBtn;
    
    private User currentUser;
    private DataService dataService;
    
    public void setUser(User user) {
        this.currentUser = user;
        loadProfile();
    }
    
    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }
    
    private void loadProfile() {
        idLabel.setText(currentUser.getUserId());
        usernameLabel.setText(currentUser.getUsername());
        emailField.setText(currentUser.getEmail());
        roleLabel.setText(currentUser.getRole().toString());
        departmentLabel.setText(currentUser.getDepartment());
    }
    
    @FXML
    private void handleUpdateProfile() {
        String email = emailField.getText().trim();
        
        if (email.isEmpty()) {
            messageLabel.setText("Email cannot be empty");
            messageLabel.setStyle("-fx-text-fill: red;");
            return;
        }
        
        if (!email.contains("@")) {
            messageLabel.setText("Invalid email format");
            messageLabel.setStyle("-fx-text-fill: red;");
            return;
        }
        
        messageLabel.setText("Profile updated successfully!");
        messageLabel.setStyle("-fx-text-fill: green;");
    }
    
    @FXML
    private void handleChangePassword() {
        String current = currentPasswordField.getText();
        String newPass = newPasswordField.getText();
        String confirm = confirmPasswordField.getText();
        
        if (current.isEmpty() || newPass.isEmpty() || confirm.isEmpty()) {
            messageLabel.setText("All password fields are required");
            messageLabel.setStyle("-fx-text-fill: red;");
            return;
        }
        
        if (!current.equals(currentUser.getPassword())) {
            messageLabel.setText("Current password is incorrect");
            messageLabel.setStyle("-fx-text-fill: red;");
            return;
        }
        
        if (newPass.length() < 6) {
            messageLabel.setText("New password must be at least 6 characters");
            messageLabel.setStyle("-fx-text-fill: red;");
            return;
        }
        
        if (!newPass.equals(confirm)) {
            messageLabel.setText("New passwords do not match");
            messageLabel.setStyle("-fx-text-fill: red;");
            return;
        }
        
        currentUser.setPassword(newPass);
        currentPasswordField.clear();
        newPasswordField.clear();
        confirmPasswordField.clear();
        
        messageLabel.setText("Password changed successfully!");
        messageLabel.setStyle("-fx-text-fill: green;");
    }
    
    @FXML
    private void handleFullscreen() {
        Stage stage = (Stage) idLabel.getScene().getWindow();
        if (stage.isFullScreen()) {
            stage.setFullScreen(false);
            fullscreenBtn.setText("⛶ Fullscreen");
        } else {
            stage.setFullScreen(true);
            fullscreenBtn.setText("⛶ Exit Fullscreen");
        }
    }
    
    @FXML
    private void handleBack() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/campuscare/view/Dashboard.fxml"));
            Stage stage = (Stage) idLabel.getScene().getWindow();
            
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
