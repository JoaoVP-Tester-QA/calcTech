import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage";
import EquationsPage from "./pages/EquationsPage/EquationsPage";
import SystemsPage from "./pages/SystemsPage";
import InterpolationPage from "./pages/InterpolationPage";
import ExtrapolationPage from "./pages/ExtrapolationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/equations" element={<EquationsPage />} />
        <Route path="/systems" element={<SystemsPage />} />
        <Route path="/interpolation" element={<InterpolationPage />} />
        <Route path="/extrapolation" element={<ExtrapolationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
