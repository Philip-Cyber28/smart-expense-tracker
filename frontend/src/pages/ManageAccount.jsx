import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import API from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ManageAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/auth/me").then((res) =>
      setUser({
        username: res.data.username,
        email: res.data.email,
      })
    );
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const updateProfile = async () => {
    try {
      await API.put("/users/me", user);
      setMessage("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
    }
  };

  const deleteAccount = async () => {
    if (!confirm("This will permanently delete your account. Continue?"))
      return;

    try {
      await API.post("/users/delete", { password });
      await API.post("/auth/logout");
      navigate("/login");
    } catch {
      setError("Incorrect password");
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto mt-6 md:mt-8 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
            Manage Account
          </h1>

          {message && (
            <p className="text-green-600 bg-green-50 p-2 rounded mb-3 text-sm">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 bg-red-50 p-2 rounded mb-3 text-sm">
              {error}
            </p>
          )}

          <h2 className="font-bold mt-4 mb-2">Edit Profile</h2>

          <Input
            className="mt-2"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Username"
          />

          <Input
            className="mt-3"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
          />

          <Button
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
            onClick={updateProfile}
          >
            Save Changes
          </Button>

          <hr className="my-6" />

          <h2 className="font-bold text-red-600 mb-2">Delete Account</h2>
          <p className="text-sm text-gray-600 mb-3">
            This action cannot be undone. Please enter your password to confirm.
          </p>

          <Input
            className="mt-2"
            type="password"
            placeholder="Confirm password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="destructive"
            className="w-full mt-3 bg-red-500 hover:bg-red-600"
            onClick={deleteAccount}
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default ManageAccount;
