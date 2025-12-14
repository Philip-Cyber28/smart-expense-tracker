import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        <h1 className="text-2xl mb-4 font-bold text-center">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          className="w-full rounded-base shadow p-2 mb-2"
        />
        <Input
          type="password"
          placeholder="Password"
          className="w-full rounded-base shadow p-2 mb-4"
        />
        <Button className="w-full bg-blue-400 text-white rounded shadow-md p-3 mb-2">
          Login
        </Button>
        <p className="text-center">
          Don't have an account?
          <Link className="text-blue-500" to="/register">
            {" "}
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
