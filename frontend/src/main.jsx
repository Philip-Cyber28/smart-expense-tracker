import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";

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
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewExpenses"
          element={
            <ProtectedRoute>
              <ViewExpenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addExpenses"
          element={
            <ProtectedRoute>
              <AddExpenses />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadExpenses"
          element={
            <ProtectedRoute>
              <UploadExpenses />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageAccount"
          element={
            <ProtectedRoute>
              <ManageAccount />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
