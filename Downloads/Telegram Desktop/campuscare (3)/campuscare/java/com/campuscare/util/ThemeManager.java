package com.campuscare.util;

import javafx.scene.Scene;

public class ThemeManager {
    private static boolean isDarkMode = false;
    
    public static void toggleTheme(Scene scene) {
        isDarkMode = !isDarkMode;
        applyTheme(scene);
    }
    
    public static void applyTheme(Scene scene) {
        scene.getStylesheets().clear();
        if (isDarkMode) {
            scene.getRoot().setStyle(
                "-fx-base: #2b2b2b; " +
                "-fx-background: #1e1e1e; " +
                "-fx-control-inner-background: #3c3c3c; " +
                "-fx-accent: #3498db;"
            );
        } else {
            scene.getRoot().setStyle("");
        }
    }
    
    public static boolean isDarkMode() {
        return isDarkMode;
    }
}
