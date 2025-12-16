import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/login", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="p-6 md:p-8 bg-white shadow-md rounded-md w-full max-w-md">
        <h1 className="text-2xl md:text-3xl mb-4 font-bold text-center">
          Login
        </h1>
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-base shadow p-2"
            placeholder="Username"
            required
          />
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-base shadow p-2"
            required
          />
          <Button className="w-full bg-blue-400 text-white rounded shadow-md p-3 hover:bg-blue-500">
            Login
          </Button>
        </form>

        <p className="text-center mt-4 text-sm md:text-base">
          Don't have an account?
          <Link className="text-blue-500 ml-1" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
