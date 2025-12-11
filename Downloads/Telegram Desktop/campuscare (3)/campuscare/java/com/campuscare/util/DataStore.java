package com.campuscare.util;

import com.campuscare.model.ServiceRequest;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class DataStore {
    public static void save(List<ServiceRequest> list, File file) throws IOException {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(file))) {
            out.writeObject(new ArrayList<>(list));
        }
    }

    @SuppressWarnings("unchecked")
    public static ObservableList<ServiceRequest> load(File file) throws IOException, ClassNotFoundException {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(file))) {
            List<ServiceRequest> l = (List<ServiceRequest>) in.readObject();
            return FXCollections.observableArrayList(l);
        }
    }
}
