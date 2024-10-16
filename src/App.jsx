import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ErrorPage from "./pages/Error/ErrorPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}
