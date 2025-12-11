package com.campuscare.util;

import javafx.animation.FadeTransition;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.stage.Popup;
import javafx.stage.Stage;
import javafx.util.Duration;

public class NotificationUtil {
    
    public static void showToast(Stage owner, String message, boolean success) {
        Popup popup = new Popup();
        
        Label label = new Label(message);
        label.setStyle(String.format(
            "-fx-background-color: %s; " +
            "-fx-text-fill: white; " +
            "-fx-padding: 15 25; " +
            "-fx-background-radius: 5; " +
            "-fx-font-size: 14px; " +
            "-fx-effect: dropshadow(gaussian, rgba(0,0,0,0.3), 10, 0, 0, 2);",
            success ? "#27ae60" : "#e74c3c"
        ));
        
        StackPane pane = new StackPane(label);
        pane.setAlignment(Pos.CENTER);
        popup.getContent().add(pane);
        
        popup.setAutoHide(true);
        popup.show(owner, 
            owner.getX() + owner.getWidth() / 2 - 100,
            owner.getY() + owner.getHeight() - 100
        );
        
        FadeTransition fade = new FadeTransition(Duration.seconds(0.5), pane);
        fade.setFromValue(1.0);
        fade.setToValue(0.0);
        fade.setDelay(Duration.seconds(2));
        fade.setOnFinished(e -> popup.hide());
        fade.play();
    }
}
