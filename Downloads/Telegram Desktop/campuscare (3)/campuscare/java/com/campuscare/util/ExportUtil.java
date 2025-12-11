package com.campuscare.util;

import com.campuscare.model.ServiceRequest;
import javafx.stage.FileChooser;
import javafx.stage.Window;
import java.io.*;
import java.util.List;

public class ExportUtil {
    
    public static void exportToPDF(List<ServiceRequest> requests, Window owner) {
        FileChooser fc = new FileChooser();
        fc.setTitle("Export to PDF");
        fc.getExtensionFilters().add(new FileChooser.ExtensionFilter("PDF Files", "*.pdf"));
        File file = fc.showSaveDialog(owner);
        
        if (file != null) {
            try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
                writer.println("CampusCare Service Requests Report");
                writer.println("=====================================\n");
                for (ServiceRequest req : requests) {
                    writer.printf("ID: %s | Requester: %s | Type: %s | Status: %s%n",
                        req.getId(), req.getRequester(), req.getType(), req.getStatus());
                }
            } catch (IOException e) {
                throw new RuntimeException("Export failed: " + e.getMessage());
            }
        }
    }
    
    public static void exportToExcel(List<ServiceRequest> requests, Window owner) {
        FileChooser fc = new FileChooser();
        fc.setTitle("Export to Excel");
        fc.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fc.showSaveDialog(owner);
        
        if (file != null) {
            try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
                writer.println("Request ID,Requester,Type,Status");
                for (ServiceRequest req : requests) {
                    writer.printf("%s,%s,%s,%s%n",
                        req.getId(), req.getRequester(), req.getType(), req.getStatus());
                }
            } catch (IOException e) {
                throw new RuntimeException("Export failed: " + e.getMessage());
            }
        }
    }
}
