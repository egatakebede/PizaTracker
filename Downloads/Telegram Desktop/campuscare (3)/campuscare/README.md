# University Service Request App – Mini Project

## Project Description
The **University Service Request App** is a **desktop application built with JavaFX** designed to **replace the outdated service request system** currently used by the university. The old system relied on paper forms, emails, and phone calls, which were **slow, inefficient, and prone to errors**.

This application provides a **modern, digital platform** for students, lecturers, and staff to **submit, track, and manage service requests efficiently**, while departments can **process and respond to requests systematically**.

**Types of Requests:**
- IT Support (software/hardware issues)
- Facilities Maintenance (repairs, room setups, equipment requests)
- Academic Advising (counseling, course guidance)
- Administrative Assistance (document requests, approvals)

**See [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md) for complete project details, objectives, actors, and UI/UX design specifications.**

---

## 🚀 Quick Start (IntelliJ IDEA)

### Prerequisites
1. **Java JDK 17+**: https://adoptium.net/temurin/releases/
2. **IntelliJ IDEA Community**: https://www.jetbrains.com/idea/download/
3. **JavaFX SDK 21**: https://gluonhq.com/products/javafx/
   - Download and extract to `C:\javafx-sdk-21`

### Setup Steps
1. Open IntelliJ IDEA → **Open** → Select `campuscare` folder
2. Wait for Maven to import dependencies (bottom-right progress bar)
3. **File** → **Project Structure** (Ctrl+Alt+Shift+S)
4. Click **Libraries** → **+** → **Java** → Browse to `C:\javafx-sdk-21\lib`
5. Click **OK** → **Apply** → **OK**
6. Right-click `Main.java` or `App.java` → **Run 'Main.main()'**
7. If error appears, click **Edit Configurations** → Add VM options:
   ```
   --module-path "C:\javafx-sdk-21\lib" --add-modules javafx.controls,javafx.fxml
   ```
8. Click **OK** → Run again

### Alternative: Maven Command Line
```bash
mvn clean install
mvn javafx:run
```

---

## ✨ Features

### Modern UI
- 🌙 **Dark Mode Toggle** - Switch between light/dark themes
- 🔍 **Real-time Search** - Filter requests as you type
- 📊 **Live Statistics** - Track pending, in-progress, completed counts
- 💬 **Toast Notifications** - Modern popup messages (green=success, red=error)
- ✨ **Smooth Animations** - Button rotations, fade effects
- 🎨 **Gradient Styling** - Professional CSS with shadows and effects

### Core Functionality
- ✅ Submit service requests (IT Support, Facilities, Academic, Administrative)
- ✅ Track request status (Pending, In Progress, Completed, Escalated)
- ✅ Save/Load data with ObjectStreams (binary file I/O)
- ✅ File attachments with FileChooser (Images, Documents, All Files)
- ✅ Search and filter requests instantly
- ✅ Statistics dashboard with real-time updates

---

## 📁 Project Structure

```
campuscare/
├── java/com/campuscare/
│   ├── App.java                    # Main application entry
│   ├── Main.java                   # Alternative entry with login
│   ├── CampusCareApp.java         # Simple standalone demo
│   ├── controller/
│   │   ├── MainController.java    # Main UI controller (search, stats, animations)
│   │   ├── LoginController.java   # Authentication
│   │   ├── DashboardController.java
│   │   └── NewRequestController.java
│   ├── model/
│   │   ├── ServiceRequest.java    # Request model with JavaFX properties
│   │   ├── User.java
│   │   ├── UserRole.java
│   │   ├── RequestStatus.java
│   │   ├── Priority.java
│   │   └── RequestCategory.java
│   └── util/
│       ├── DataStore.java         # File I/O with ObjectStreams
│       ├── DataService.java       # CSV export, authentication
│       ├── ThemeManager.java      # Dark mode toggle
│       └── NotificationUtil.java  # Toast notifications
├── resources/com/campuscare/
│   ├── view/
│   │   ├── MainView.fxml          # Main UI layout
│   │   ├── Login.fxml
│   │   ├── Dashboard.fxml
│   │   └── NewRequest.fxml
│   └── css/
│       ├── styles.css             # Modern styling with gradients
│       └── style.css
└── pom.xml                         # Maven configuration
```

---

## 🎓 JavaFX Concepts Demonstrated

### Chapter 3: JavaFX GUI ✅
- **Layouts**: VBox, HBox, BorderPane, GridPane
- **Controls**: TextField, Button, TableView, ChoiceBox, TextArea, Label
- **Event Handling**: @FXML annotations, setOnAction, lambda expressions
- **Properties & Bindings**: StringProperty, FilteredList, property listeners
- **CSS Styling**: Gradients, drop shadows, hover effects, focus states
- **Animations**: RotateTransition, FadeTransition
- **Composite Controls**: Modal dialogs, custom alerts, toast notifications

### Chapter 4: Streams & File I/O ✅
- **Object Serialization**: ObjectInputStream/ObjectOutputStream for data persistence
- **FileChooser**: File selection with extension filters
- **Java Streams API**: filter(), count(), map() for searching and statistics
- **Binary Files**: Save/load requests to `requests.dat`
- **CSV Export**: PrintWriter/FileWriter for reports

---

## 🧪 Testing Features

1. **Add Request**
   - Fill requester name
   - Select request type
   - Select status
   - Click "Add Request"
   - See toast notification and stats update

2. **Real-time Search**
   - Type in search box
   - Watch table filter instantly
   - Searches: ID, requester, type, status

3. **Dark Mode**
   - Click "🌙 Theme" button in header
   - See smooth theme transition
   - Toast notification confirms change

4. **Save/Load Data**
   - Add some requests
   - Click "Save" → See success toast
   - Close application
   - Reopen and click "Load"
   - See all requests restored

5. **File Attachments**
   - Click "Attach File"
   - Select file (organized by type)
   - See confirmation toast

6. **Live Statistics**
   - Watch stats update automatically
   - Shows: Total, Pending, In Progress, Completed

---

## 🎨 Modern Features

### Toast Notifications
- Auto-dismiss after 2 seconds
- Fade in/out animations
- Color-coded: Green (success), Red (error)
- Positioned at bottom-center

### Button Animations
- 360° rotation on click
- Smooth transitions
- Visual feedback for all actions

### Search & Filter
- FilteredList for efficient filtering
- Real-time updates as you type
- Searches across all fields

### Theme Toggle
- Light mode (default)
- Dark mode with custom colors
- Persists during session

### Statistics Dashboard
- Java Streams for counting
- Updates on add/load/filter
- Shows distribution of statuses

---

## 🛠️ Build Tools

### Maven (Recommended)
```bash
mvn clean install
mvn javafx:run
```

### Gradle
```bash
gradle build
gradle run
```

---

## 📝 Default Credentials (Full Version)

- **Admin**: admin / admin123
- **Student**: student1 / pass123
- **Lecturer**: lecturer1 / pass123
- **Staff**: staff1 / pass123

---

## 🐛 Troubleshooting

### "Error: JavaFX runtime components are missing"
- Verify JavaFX is at: `C:\javafx-sdk-21\lib`
- Check VM options in Run Configuration
- Ensure path uses forward slashes: `C:/javafx-sdk-21/lib`

### "Cannot resolve symbol 'javafx'"
- File → Project Structure → Libraries
- Verify JavaFX library is added
- Click Apply → OK
- File → Invalidate Caches → Restart

### Maven not downloading dependencies
- Right-click `pom.xml` → Maven → Reload Project
- Check internet connection
- View → Tool Windows → Maven → Reload

### Project structure issues
- File → Project Structure → Project
- Set SDK to Java 17 or higher
- Set language level to 17

---

## 📦 Running Different Versions

### Simple Version (No FXML)
Run `CampusCareApp.java` - Standalone demo with all features in one file

### Full Version (With Login)
Run `App.java` or `Main.java` - Both start with authentication screen

---

## 🎯 Key Highlights

✅ **Pure JavaFX** - No web technologies  
✅ **Modern UI** - Dark mode, animations, gradients  
✅ **FXML Separation** - Clean MVC architecture  
✅ **File I/O** - ObjectStreams + CSV export  
✅ **Streams API** - Modern Java filtering  
✅ **Properties** - JavaFX property binding  
✅ **Animations** - Smooth transitions  
✅ **Real-time Search** - Instant filtering  
✅ **Toast Notifications** - Modern UX  
✅ **Complete Documentation** - This README  

---

## 📄 License

Educational project for JavaFX curriculum demonstration.

---

## 🎓 Course Alignment

This project demonstrates all required concepts from:
- **Chapter 3**: JavaFX GUI (Layouts, Controls, Events, Properties, CSS, Animations)
- **Chapter 4**: Streams and File I/O (ObjectStreams, FileChooser, Java Streams API)

Perfect for university coursework, portfolio projects, or learning JavaFX development!
