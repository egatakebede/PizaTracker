// Simple standalone JavaFX application
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import java.util.UUID;

public class CampusCareApp extends Application {
    
    private ObservableList<String> requests = FXCollections.observableArrayList();
    private ListView<String> requestList = new ListView<>(requests);
    
    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("CampusCare - Service Request System");
        
        // Create UI components
        TextField titleField = new TextField();
        titleField.setPromptText("Request Title");
        
        ComboBox<String> categoryBox = new ComboBox<>();
        categoryBox.getItems().addAll("IT Support", "Facilities Maintenance", "Academic Advising", "Administrative Assistance");
        categoryBox.setPromptText("Select Category");
        
        ComboBox<String> priorityBox = new ComboBox<>();
        priorityBox.getItems().addAll("LOW", "MEDIUM", "HIGH", "URGENT");
        priorityBox.setValue("MEDIUM");
        
        TextArea descArea = new TextArea();
        descArea.setPromptText("Description");
        descArea.setPrefRowCount(3);
        
        Button submitBtn = new Button("Submit Request");
        Button clearBtn = new Button("Clear");
        
        // Event handlers
        submitBtn.setOnAction(e -> {
            if (!titleField.getText().isEmpty() && categoryBox.getValue() != null) {
                String id = "REQ" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                String request = String.format("[%s] %s - %s (%s)", 
                    id, titleField.getText(), categoryBox.getValue(), priorityBox.getValue());
                requests.add(request);
                
                titleField.clear();
                descArea.clear();
                categoryBox.setValue(null);
                priorityBox.setValue("MEDIUM");
                
                showAlert("Success", "Request submitted: " + id);
            } else {
                showAlert("Error", "Please fill title and category");
            }
        });
        
        clearBtn.setOnAction(e -> {
            titleField.clear();
            descArea.clear();
            categoryBox.setValue(null);
            priorityBox.setValue("MEDIUM");
        });
        
        // Layout
        VBox form = new VBox(10);
        form.setPadding(new Insets(20));
        form.getChildren().addAll(
            new Label("New Service Request"),
            new Label("Title:"), titleField,
            new Label("Category:"), categoryBox,
            new Label("Priority:"), priorityBox,
            new Label("Description:"), descArea,
            new HBox(10, submitBtn, clearBtn)
        );
        
        VBox listBox = new VBox(10);
        listBox.setPadding(new Insets(20));
        listBox.getChildren().addAll(
            new Label("Submitted Requests"),
            requestList
        );
        
        HBox root = new HBox(20, form, listBox);
        root.setPadding(new Insets(20));
        
        Scene scene = new Scene(root, 800, 500);
        primaryStage.setScene(scene);
        primaryStage.show();
        
        // Add sample data
        requests.addAll(
            "[REQ001] Fix printer - IT Support (HIGH)",
            "[REQ002] Room booking - Administrative Assistance (MEDIUM)"
        );
    }
    
    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setContentText(message);
        alert.showAndWait();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}