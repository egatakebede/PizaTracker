package com.campuscare.controller;

import com.campuscare.model.*;
import com.campuscare.util.DataService;
import javafx.collections.FXCollections;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.FileChooser;
import javafx.stage.Modality;
import javafx.stage.Stage;
import java.io.File;
import java.util.List;
import javafx.scene.control.TableCell;

public class DashboardController {
    @FXML private Label welcomeLabel;
    @FXML private TableView<ServiceRequest> requestTable;
    @FXML private TableColumn<ServiceRequest, String> idColumn;
    @FXML private TableColumn<ServiceRequest, String> titleColumn;
    @FXML private TableColumn<ServiceRequest, RequestCategory> categoryColumn;
    @FXML private TableColumn<ServiceRequest, RequestStatus> statusColumn;
    @FXML private TableColumn<ServiceRequest, Priority> priorityColumn;
    @FXML private TableColumn<ServiceRequest, String> createdColumn;
    @FXML private TextField searchField;
    @FXML private ComboBox<RequestStatus> statusFilter;
    @FXML private Button analyticsBtn;
    @FXML private Button exportBtn;
    @FXML private Button manageBtn;
    @FXML private Button editBtn;
    @FXML private Button cancelRequestBtn;
    @FXML private Button assignBtn;
    @FXML private Button acceptBtn;
    @FXML private Button rejectBtn;
    @FXML private Button updateStatusBtn;
    @FXML private Button deleteBtn;
    
    private User currentUser;
    private DataService dataService;
    
    public void setUser(User user) {
        this.currentUser = user;
        welcomeLabel.setText("Welcome, " + user.getUsername() + " (" + user.getRole() + ")");
        configureRoleBasedUI();
        loadRequests();
    }
    
    private void configureRoleBasedUI() {
        UserRole role = currentUser.getRole();
        
        if (role == UserRole.ADMIN) {
            analyticsBtn.setVisible(true);
            analyticsBtn.setManaged(true);
            exportBtn.setVisible(true);
            exportBtn.setManaged(true);
            manageBtn.setVisible(true);
            manageBtn.setManaged(true);
            assignBtn.setVisible(true);
            assignBtn.setManaged(true);
            acceptBtn.setVisible(true);
            acceptBtn.setManaged(true);
            rejectBtn.setVisible(true);
            rejectBtn.setManaged(true);
            updateStatusBtn.setVisible(true);
            updateStatusBtn.setManaged(true);
            deleteBtn.setVisible(true);
            deleteBtn.setManaged(true);
            editBtn.setVisible(false);
            editBtn.setManaged(false);
            cancelRequestBtn.setVisible(false);
            cancelRequestBtn.setManaged(false);
        } else if (role == UserRole.DEPARTMENT_STAFF) {
            assignBtn.setVisible(true);
            assignBtn.setManaged(true);
            acceptBtn.setVisible(true);
            acceptBtn.setManaged(true);
            rejectBtn.setVisible(true);
            rejectBtn.setManaged(true);
            updateStatusBtn.setVisible(true);
            updateStatusBtn.setManaged(true);
            exportBtn.setVisible(true);
            exportBtn.setManaged(true);
            editBtn.setVisible(false);
            editBtn.setManaged(false);
            cancelRequestBtn.setVisible(false);
            cancelRequestBtn.setManaged(false);
        } else {
            editBtn.setVisible(true);
            editBtn.setManaged(true);
            cancelRequestBtn.setVisible(true);
            cancelRequestBtn.setManaged(true);
        }
    }
    
    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }
    
    @FXML
    private void initialize() {
        idColumn.setCellValueFactory(new PropertyValueFactory<>("requestId"));
        titleColumn.setCellValueFactory(new PropertyValueFactory<>("title"));
        categoryColumn.setCellValueFactory(new PropertyValueFactory<>("category"));
        statusColumn.setCellValueFactory(new PropertyValueFactory<>("status"));
        priorityColumn.setCellValueFactory(new PropertyValueFactory<>("priority"));
        createdColumn.setCellValueFactory(new PropertyValueFactory<>("createdAt"));
        
        statusColumn.setCellFactory(col -> new TableCell<ServiceRequest, RequestStatus>() {
            @Override
            protected void updateItem(RequestStatus status, boolean empty) {
                super.updateItem(status, empty);
                if (empty || status == null) {
                    setText(null);
                    setStyle("");
                } else {
                    setText(status.toString());
                    switch (status) {
                        case DRAFT -> setStyle("-fx-text-fill: #6C757D; -fx-font-weight: bold;");
                        case PENDING -> setStyle("-fx-text-fill: #FFC107; -fx-font-weight: bold;");
                        case IN_PROGRESS -> setStyle("-fx-text-fill: #1E90FF; -fx-font-weight: bold;");
                        case WAITING_FOR_USER -> setStyle("-fx-text-fill: #FF6B6B; -fx-font-weight: bold;");
                        case COMPLETED -> setStyle("-fx-text-fill: #28A745; -fx-font-weight: bold;");
                        case REJECTED -> setStyle("-fx-text-fill: #DC3545; -fx-font-weight: bold;");
                        case CANCELLED -> setStyle("-fx-text-fill: #6C757D; -fx-font-weight: bold;");
                    }
                }
            }
        });
        
        priorityColumn.setCellFactory(col -> new TableCell<ServiceRequest, Priority>() {
            @Override
            protected void updateItem(Priority priority, boolean empty) {
                super.updateItem(priority, empty);
                if (empty || priority == null) {
                    setText(null);
                    setStyle("");
                } else {
                    setText(priority.toString());
                    if (priority == Priority.URGENT) {
                        setStyle("-fx-text-fill: #DC3545; -fx-font-weight: bold;");
                    } else if (priority == Priority.HIGH) {
                        setStyle("-fx-text-fill: #FFC107; -fx-font-weight: bold;");
                    }
                }
            }
        });
        
        statusFilter.setItems(FXCollections.observableArrayList(RequestStatus.values()));
        statusFilter.setOnAction(e -> filterRequests());
        
        searchField.textProperty().addListener((obs, old, newVal) -> filterRequests());
    }
    
    private void loadRequests() {
        List<ServiceRequest> requests;
        if (currentUser.getRole() == UserRole.ADMIN) {
            requests = dataService.getAllRequests();
        } else if (currentUser.getRole() == UserRole.DEPARTMENT_STAFF) {
            requests = dataService.getRequestsByDepartment(currentUser.getDepartment());
        } else {
            requests = dataService.getRequestsByUser(currentUser.getUserId());
        }
        requestTable.setItems(FXCollections.observableArrayList(requests));
    }
    
    private void filterRequests() {
        List<ServiceRequest> requests;
        if (currentUser.getRole() == UserRole.ADMIN) {
            requests = dataService.getAllRequests();
        } else if (currentUser.getRole() == UserRole.DEPARTMENT_STAFF) {
            requests = dataService.getRequestsByDepartment(currentUser.getDepartment());
        } else {
            requests = dataService.getRequestsByUser(currentUser.getUserId());
        }
        
        String search = searchField.getText().toLowerCase();
        RequestStatus status = statusFilter.getValue();
        
        List<ServiceRequest> filtered = requests.stream()
            .filter(r -> search.isEmpty() || r.getTitle().toLowerCase().contains(search) || 
                        r.getRequestId().toLowerCase().contains(search))
            .filter(r -> status == null || r.getStatus() == status)
            .toList();
        
        requestTable.setItems(FXCollections.observableArrayList(filtered));
    }
    
    @FXML
    private void handleNewRequest() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/campuscare/view/NewRequest.fxml"));
            Scene scene = new Scene(loader.load());
            
            NewRequestController controller = loader.getController();
            controller.setUser(currentUser);
            controller.setDataService(dataService);
            controller.setDashboardController(this);
            controller.initializeDepartments();
            
            Stage stage = new Stage();
            stage.setTitle("Campath - New Request");
            stage.setScene(scene);
            stage.initModality(Modality.APPLICATION_MODAL);
            stage.showAndWait();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @FXML
    private void handleExport() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Export Requests");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fileChooser.showSaveDialog(requestTable.getScene().getWindow());
        
        if (file != null) {
            try {
                dataService.exportToCSV(file.getAbsolutePath(), requestTable.getItems());
                showAlert("Export successful", "Requests exported to " + file.getName());
            } catch (Exception e) {
                showAlert("Export failed", e.getMessage());
            }
        }
    }
    
    @FXML
    private void handleAnalytics() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/campuscare/view/Analytics.fxml"));
            Stage stage = (Stage) welcomeLabel.getScene().getWindow();
            
            Scene scene = new Scene(loader.load());
            scene.getStylesheets().add(getClass().getResource("/com/campuscare/css/styles.css").toExternalForm());
            
            AnalyticsController controller = loader.getController();
            controller.setDataService(dataService);
            controller.setUser(currentUser);
            
            stage.setScene(scene);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @FXML
    private void handleManage() {
        showAlert("Manage", "Admin panel for managing all requests");
    }
    
    @FXML
    private void handleAssign() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        selected.setAssignedTo(currentUser.getUsername());
        if (selected.getStatus() == RequestStatus.PENDING) {
            selected.setStatus(RequestStatus.IN_PROGRESS);
        }
        dataService.updateRequest(selected);
        requestTable.refresh();
        showAlert("Success", "Request assigned to you");
    }
    
    @FXML
    private void handleEdit() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        if (selected.getStatus() != RequestStatus.DRAFT && selected.getStatus() != RequestStatus.PENDING) {
            showAlert("Cannot Edit", "Only DRAFT or PENDING requests can be edited");
            return;
        }
        
        showAlert("Edit Request", "Edit functionality - Update title, description, priority");
    }
    
    @FXML
    private void handleCancelRequest() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        if (selected.getStatus() == RequestStatus.COMPLETED || selected.getStatus() == RequestStatus.CANCELLED) {
            showAlert("Cannot Cancel", "Request is already completed or cancelled");
            return;
        }
        
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
        confirm.setTitle("Cancel Request");
        confirm.setContentText("Are you sure you want to cancel request " + selected.getRequestId() + "?");
        
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                selected.setStatus(RequestStatus.CANCELLED);
                dataService.updateRequest(selected);
                requestTable.refresh();
                showAlert("Success", "Request cancelled");
            }
        });
    }
    
    @FXML
    private void handleAccept() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        selected.setStatus(RequestStatus.IN_PROGRESS);
        selected.setAssignedTo(currentUser.getUsername());
        selected.addComment("Request accepted by " + currentUser.getUsername());
        dataService.updateRequest(selected);
        requestTable.refresh();
        showAlert("Success", "Request accepted and assigned to you");
    }
    
    @FXML
    private void handleReject() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        TextInputDialog dialog = new TextInputDialog();
        dialog.setTitle("Reject Request");
        dialog.setHeaderText("Request: " + selected.getRequestId());
        dialog.setContentText("Reason for rejection:");
        
        dialog.showAndWait().ifPresent(reason -> {
            selected.setStatus(RequestStatus.REJECTED);
            selected.addComment("Rejected by " + currentUser.getUsername() + ": " + reason);
            dataService.updateRequest(selected);
            requestTable.refresh();
            showAlert("Success", "Request rejected");
        });
    }
    
    @FXML
    private void handleProfile() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/campuscare/view/Profile.fxml"));
            Stage stage = (Stage) welcomeLabel.getScene().getWindow();
            
            Scene scene = new Scene(loader.load());
            scene.getStylesheets().add(getClass().getResource("/com/campuscare/css/styles.css").toExternalForm());
            
            ProfileController controller = loader.getController();
            controller.setDataService(dataService);
            controller.setUser(currentUser);
            
            stage.setScene(scene);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @FXML
    private void handleLogout() {
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
        confirm.setTitle("Logout");
        confirm.setHeaderText("Are you sure you want to logout?");
        confirm.setContentText("You will be redirected to the login page.");
        
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                try {
                    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/campuscare/view/Login.fxml"));
                    Stage stage = (Stage) welcomeLabel.getScene().getWindow();
                    
                    Scene scene = new Scene(loader.load());
                    scene.getStylesheets().add(getClass().getResource("/com/campuscare/css/styles.css").toExternalForm());
                    
                    stage.setTitle("Campath - Login");
                    stage.setScene(scene);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    @FXML
    private void handleComment() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        TextInputDialog dialog = new TextInputDialog();
        dialog.setTitle("Add Comment");
        dialog.setHeaderText("Request: " + selected.getRequestId());
        dialog.setContentText("Comment:");
        
        dialog.showAndWait().ifPresent(comment -> {
            selected.addComment(currentUser.getUsername() + ": " + comment);
            dataService.updateRequest(selected);
            showAlert("Success", "Comment added");
        });
    }
    
    @FXML
    private void handleUpdateStatus() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        ChoiceDialog<RequestStatus> dialog = new ChoiceDialog<>(selected.getStatus(), RequestStatus.values());
        dialog.setTitle("Update Status");
        dialog.setHeaderText("Request: " + selected.getRequestId());
        dialog.setContentText("New status:");
        
        dialog.showAndWait().ifPresent(status -> {
            selected.setStatus(status);
            dataService.updateRequest(selected);
            requestTable.refresh();
            showAlert("Success", "Status updated to " + status);
        });
    }
    
    @FXML
    private void handleDelete() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected == null) {
            showAlert("No Selection", "Please select a request");
            return;
        }
        
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION);
        confirm.setTitle("Confirm Delete");
        confirm.setContentText("Delete request " + selected.getRequestId() + "?");
        
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                dataService.deleteRequest(selected.getRequestId());
                loadRequests();
                showAlert("Success", "Request deleted");
            }
        });
    }
    
    @FXML
    private void handleViewDetails() {
        ServiceRequest selected = requestTable.getSelectionModel().getSelectedItem();
        if (selected != null) {
            showRequestDetails(selected);
        }
    }
    
    private void showRequestDetails(ServiceRequest request) {
        StringBuilder details = new StringBuilder();
        details.append(String.format("Title: %s%n", request.getTitle()));
        details.append(String.format("Category: %s%n", request.getCategory()));
        details.append(String.format("Status: %s%n", request.getStatus()));
        details.append(String.format("Priority: %s%n", request.getPriority()));
        details.append(String.format("Requester: %s%n", request.getRequesterId()));
        details.append(String.format("Department: %s%n", request.getDepartmentId()));
        details.append(String.format("Assigned To: %s%n", request.getAssignedTo() != null ? request.getAssignedTo() : "Unassigned"));
        details.append(String.format("Created: %s%n", request.getCreatedAt()));
        if (request.getCompletedAt() != null) {
            details.append(String.format("Completed: %s%n", request.getCompletedAt()));
            details.append(String.format("Resolution Time: %d hours%n", request.getResolutionTimeHours()));
        }
        details.append(String.format("Description: %s%n%n", request.getDescription()));
        
        if (!request.getComments().isEmpty()) {
            details.append("Comments:%n");
            for (String comment : request.getComments()) {
                details.append("  • " + comment + "%n");
            }
        }
        
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Request Details");
        alert.setHeaderText("Request ID: " + request.getRequestId());
        alert.setContentText(details.toString());
        alert.getDialogPane().setPrefWidth(500);
        alert.showAndWait();
    }
    
    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
    
    public void refresh() {
        loadRequests();
    }
}
