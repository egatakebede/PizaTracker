package com.campuscare.controller;

import com.campuscare.model.ServiceRequest;
import com.campuscare.model.RequestStatus;
import com.campuscare.util.DataStore;
import com.campuscare.util.NotificationUtil;
import com.campuscare.util.ThemeManager;
import com.campuscare.util.ExportUtil;
import com.campuscare.util.ReportGenerator;
import javafx.animation.RotateTransition;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.FileChooser;
import javafx.util.Duration;

import java.io.File;
import java.util.UUID;

public class MainController {
    @FXML private TableView<ServiceRequest> table;
    @FXML private TableColumn<ServiceRequest,String> colId, colRequester, colType;
    @FXML private TableColumn<ServiceRequest,RequestStatus> colStatus;
    @FXML private TextField requesterField;
    @FXML private TextField searchField;
    @FXML private ChoiceBox<String> typeChoice;
    @FXML private ChoiceBox<String> priorityChoice;
    @FXML private ChoiceBox<String> statusChoice;
    @FXML private Button addButton, saveButton, loadButton, attachButton, themeButton, exportPdfButton, exportExcelButton, reportButton, printButton, deleteButton;
    @FXML private Label statsLabel;

    private ObservableList<ServiceRequest> requests = FXCollections.observableArrayList();
    private FilteredList<ServiceRequest> filteredRequests;

    @FXML
    public void initialize() {
        colId.setCellValueFactory(cell -> cell.getValue().idProperty());
        colRequester.setCellValueFactory(cell -> cell.getValue().requesterProperty());
        colType.setCellValueFactory(cell -> cell.getValue().typeProperty());
        colStatus.setCellValueFactory(cell -> new javafx.beans.property.SimpleObjectProperty<>(cell.getValue().getStatus()));

        typeChoice.getItems().addAll("IT Support","Facilities Maintenance","Academic Advising","Administrative Assistance");
        priorityChoice.getItems().addAll("LOW","MEDIUM","HIGH","URGENT");
        priorityChoice.setValue("MEDIUM");
        statusChoice.getItems().addAll("Pending","In Progress","Completed","Escalated");
        statusChoice.setValue("Pending");

        filteredRequests = new FilteredList<>(requests, p -> true);
        table.setItems(filteredRequests);
        
        if (searchField != null) {
            searchField.textProperty().addListener((obs, old, newVal) -> filterRequests());
        }
        
        updateStats();
    }

    @FXML
    private void onAdd() {
        String id = UUID.randomUUID().toString().substring(0,8);
        String requester = requesterField.getText().trim();
        String type = typeChoice.getValue();
        String status = statusChoice.getValue();
        if(requester.isEmpty() || type==null) {
            showToast("Please fill requester and type.", false);
            return;
        }
        ServiceRequest r = new ServiceRequest(id, requester, type, status);
        requests.add(r);
        requesterField.clear();
        animateButton(addButton);
        showToast("Request added successfully!", true);
        updateStats();
    }

    @FXML
    private void onSave() {
        try {
            DataStore.save(requests, new File("requests.dat"));
            animateButton(saveButton);
            showToast("Saved " + requests.size() + " requests", true);
        } catch(Exception e){ 
            showToast("Save failed: "+e.getMessage(), false); 
        }
    }

    @FXML
    private void onLoad() {
        try {
            ObservableList<ServiceRequest> loaded = DataStore.load(new File("requests.dat"));
            requests.setAll(loaded);
            animateButton(loadButton);
            showToast("Loaded "+loaded.size()+" requests", true);
            updateStats();
        } catch(Exception e){ 
            showToast("Load failed: "+e.getMessage(), false); 
        }
    }

    @FXML
    private void onExportPDF() {
        try {
            ExportUtil.exportToPDF(requests, addButton.getScene().getWindow());
            showToast("Exported to PDF successfully", true);
        } catch (Exception e) {
            showToast("Export failed: " + e.getMessage(), false);
        }
    }
    
    @FXML
    private void onExportExcel() {
        try {
            ExportUtil.exportToExcel(requests, addButton.getScene().getWindow());
            showToast("Exported to Excel successfully", true);
        } catch (Exception e) {
            showToast("Export failed: " + e.getMessage(), false);
        }
    }
    
    @FXML
    private void onGenerateReport() {
        try {
            String filename = "CampusCare_Report_" + System.currentTimeMillis() + ".txt";
            ReportGenerator.generateSummaryReport(requests, filename);
            showToast("Report generated: " + filename, true);
        } catch (Exception e) {
            showToast("Report failed: " + e.getMessage(), false);
        }
    }
    
    @FXML
    private void onPrint() {
        showToast("Print dialog opened", true);
    }
    
    @FXML
    private void onDelete() {
        ServiceRequest selected = table.getSelectionModel().getSelectedItem();
        if (selected != null) {
            requests.remove(selected);
            showToast("Request deleted", true);
            updateStats();
        } else {
            showToast("Please select a request to delete", false);
        }
    }
    
    @FXML
    private void onAttach() {
        FileChooser fc = new FileChooser();
        fc.getExtensionFilters().addAll(
            new FileChooser.ExtensionFilter("All Files", "*.*"),
            new FileChooser.ExtensionFilter("Images", "*.png", "*.jpg", "*.jpeg"),
            new FileChooser.ExtensionFilter("Documents", "*.pdf", "*.docx", "*.txt")
        );
        File f = fc.showOpenDialog(attachButton.getScene().getWindow());
        if(f!=null) {
            animateButton(attachButton);
            showToast("Attached: "+f.getName(), true);
        }
    }
    
    @FXML
    private void onToggleTheme() {
        ThemeManager.toggleTheme(themeButton.getScene());
        showToast(ThemeManager.isDarkMode() ? "Dark mode enabled" : "Light mode enabled", true);
    }
    
    private void filterRequests() {
        String search = searchField.getText() == null ? "" : searchField.getText().toLowerCase();
        filteredRequests.setPredicate(request -> {
            if (search.isEmpty()) return true;
            String statusText = request.getStatus() == null ? "" : request.getStatus().name().toLowerCase();
            return (request.getId() != null && request.getId().toLowerCase().contains(search)) ||
                   (request.getRequester() != null && request.getRequester().toLowerCase().contains(search)) ||
                   (request.getType() != null && request.getType().toLowerCase().contains(search)) ||
                   statusText.contains(search);
        });
        updateStats();
    }
    
    private void updateStats() {
        if (statsLabel != null) {
            long pending = requests.stream().filter(r -> r.getStatus() == RequestStatus.PENDING).count();
            long inProgress = requests.stream().filter(r -> r.getStatus() == RequestStatus.IN_PROGRESS).count();
            long completed = requests.stream().filter(r -> r.getStatus() == RequestStatus.COMPLETED).count();
            statsLabel.setText(String.format("Total: %d | Pending: %d | In Progress: %d | Completed: %d", 
                requests.size(), pending, inProgress, completed));
        }
    }
    
    private void animateButton(Button button) {
        RotateTransition rotate = new RotateTransition(Duration.millis(200), button);
        rotate.setByAngle(360);
        rotate.play();
    }

    private void showToast(String msg, boolean success) {
        if (addButton.getScene() != null && addButton.getScene().getWindow() != null) {
            NotificationUtil.showToast((javafx.stage.Stage) addButton.getScene().getWindow(), msg, success);
        }
    }
}
