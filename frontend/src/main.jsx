import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ViewExpenses from "./pages/ViewExpenses";
import AddExpenses from "./pages/AddExpenses";
import UploadExpenses from "./pages/UploadExpenses";
import ManageAccount from "./pages/ManageAccount";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/viewExpenses" element={<ViewExpenses />} />
        <Route path="/addExpenses" element={<AddExpenses />} />
        <Route path="/uploadExpenses" element={<UploadExpenses />} />
        <Route path="/manageAccount" element={<ManageAccount />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
