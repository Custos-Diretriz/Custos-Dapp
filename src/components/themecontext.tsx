// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState("style.css");

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") || "style.css";
//     setTheme(storedTheme);
//     document
//       .getElementById("theme-stylesheet")
//       .setAttribute("href", `/${storedTheme}`);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "style.css" ? "global.css" : "style.css";
//     setTheme(newTheme);
//     document
//       .getElementById("theme-stylesheet")
//       .setAttribute("href", `/${newTheme}`);
//     localStorage.setItem("theme", newTheme);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);
