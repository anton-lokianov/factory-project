import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Shifts from "./pages/Shifts";
import { RootState } from "./redux/Store";
import { useSelector } from "react-redux";

function Layout() {
  const location = useLocation();
  const hideNavBar = location.pathname !== "/";
  return (
    <div className="App">
      <header>{hideNavBar && <NavBar />}</header>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
