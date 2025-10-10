import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

// Function to get the initial theme from localStorage or system preference
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("pharmacyTheme");
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // This function runs whenever the theme state changes
  useEffect(() => {
    const root = document.documentElement; // This is the <html> tag
    
    // Set the class on the <html> tag
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    
    // Save the new theme preference to localStorage
    localStorage.setItem("pharmacyTheme", theme);
  }, [theme]);

  // The function that the toggle button calls
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};