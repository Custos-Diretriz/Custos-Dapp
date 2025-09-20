// "use client";
// import { useState, useEffect } from "react";

// const ThemeToggle = () => {
//   const [theme, setTheme] = useState("global.css");

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     const themeStylesheet = document.getElementById("theme-stylesheet");

//     if (storedTheme && themeStylesheet) {
//       setTheme(storedTheme);
//       themeStylesheet.setAttribute("href", `/${storedTheme}`);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "global.css" ? "style.css" : "global.css";
//     setTheme(newTheme);
//     const themeStylesheet = document.getElementById("theme-stylesheet");

//     if (themeStylesheet) {
//       themeStylesheet.setAttribute("href", `/${newTheme}`);
//       localStorage.setItem("theme", newTheme);
//     }
//   };

//   return <button onClick={toggleTheme}>Toggle Theme</button>;
// };

// export default ThemeToggle;
