package com.campuscare.util;

import com.campuscare.model.ServiceRequest;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ReportGenerator {
    
    public static void generateSummaryReport(List<ServiceRequest> requests, String filename) throws Exception {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filename))) {
            writer.println("=== CampusCare Service Request Summary Report ===");
            writer.println("Generated: " + java.time.LocalDateTime.now());
            writer.println();
            
            writer.println("Total Requests: " + requests.size());
            writer.println();
            
            // Group by status
            Map<String, Long> byStatus = requests.stream()
                .collect(Collectors.groupingBy(
                    r -> r.getStatus() == null ? "UNKNOWN" : r.getStatus().name(),
                    Collectors.counting()
                ));
            
            writer.println("Requests by Status:");
            byStatus.forEach((status, count) -> 
                writer.println("  " + status + ": " + count)
            );
            writer.println();
            
            // Group by type
            Map<String, Long> byType = requests.stream()
                .filter(r -> r.getType() != null)
                .collect(Collectors.groupingBy(
                    ServiceRequest::getType,
                    Collectors.counting()
                ));
            
            writer.println("Requests by Type:");
            byType.forEach((type, count) -> 
                writer.println("  " + type + ": " + count)
            );
            writer.println();
            
            writer.println("=== Detailed Request List ===");
            writer.println();
            for (ServiceRequest req : requests) {
                writer.printf("[%s] %s - %s (%s)%n",
                    req.getId(),
                    req.getRequester(),
                    req.getType(),
                    req.getStatus()
                );
            }
        }
    }
}
