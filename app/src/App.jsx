import { React } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";

import Login from "./pages/login";
import Home from "./pages/home";
import SignUp from "./pages/signup";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#ff5722",
      dark: "#d50000",
      contrastText: "#ffffff",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
