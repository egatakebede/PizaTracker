# Frontend change — React removed, JavaFX used

Summary
- The repository no longer contains React `.tsx` component files. The project now uses the existing JavaFX UI (FXML + Java controllers) as the single UI implementation.

What I changed
- Verified there are no `.tsx` files remaining in `components/` (the `components` directory was already removed).
- Added this file to document the change and where the JavaFX UI lives.

Where the JavaFX UI is
- FXML files: `resources/com/campuscare/view/*.fxml` (Login.fxml, MainView.fxml, Dashboard.fxml, NewRequest.fxml)
- Java controllers: `java/com/campuscare/controller/*Controller.java`
- Application entry points: `java/com/campuscare/App.java` (and/or `Main.java`)

How to run the JavaFX app (short)
1. Download JavaFX SDK (e.g. OpenJFX 25) and unzip it, note the `lib` path.
2. Build and run using the provided PowerShell scripts:
   - Build: `.uild.ps1 -JavaHome $env:JAVA_HOME -JavaFxLib "C:\path\to\javafx-sdk\lib"`
   - Run:   `.


















If you want me to proceed with further removals, tell me which artifacts to remove.- Commit these changes to a new branch and push (I can prepare commands you can run).- Add a short migration note in `FINAL_README.md` describing the switch.- Remove leftover Node/Maven/TS files completely.If you'd like, I can also:- `RequestList.tsx`   → `resources/com/campuscare/view/MainView.fxml` + `MainController.java`- `NewRequestForm.tsx`→ `resources/com/campuscare/view/NewRequest.fxml` + `NewRequestController.java`- `Dashboard.tsx`     → `resources/com/campuscare/view/Dashboard.fxml` + `DashboardController.java`- `LoginScreen.tsx` → `resources/com/campuscare/view/Login.fxml` + `LoginController.java`Mapping (React → JavaFX)- If you want me to fully remove Node/React configuration (e.g., `package.json`, `tsconfig.json`, `vite.config.ts`, etc.), say `remove node` and I'll prepare a safe removal patch and update README.- If you still have a `package.json` and other Node/React files, they are left in the repo for now; only `.tsx` React components were removed (they were already gone).Notesun.ps1   -JavaHome $env:JAVA_HOME -JavaFxLib "C:\path\to\javafx-sdk\lib"`