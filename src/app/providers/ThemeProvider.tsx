import React, { ReactNode, useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline, Button } from "@mui/material";
import { lightTheme, darkTheme } from "../theme";  

interface ThemeProviderProps {
  children: ReactNode; 
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <MUIThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={toggleTheme} 
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        Переключить тему
      </Button>
    </MUIThemeProvider>
  );
};

export default ThemeProvider;

