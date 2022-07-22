import { React } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";

import Login from "./pages/login";
import Home from "./pages/home";
import SignUp from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
