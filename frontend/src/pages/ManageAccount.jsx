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
      <div className="max-w-md mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Manage Account</h1>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <h2 className="font-bold mt-4">Edit Profile</h2>

        <Input
          className="mt-2"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
        />

        <Input
          className="mt-2"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />

        <Button
          className="w-full mt-3 bg-green-500 text-white"
          onClick={updateProfile}
        >
          Save Changes
        </Button>

        <hr className="my-6" />

        <h2 className="font-bold text-red-600">Delete Account</h2>

        <Input
          className="mt-2"
          type="password"
          placeholder="Confirm password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="destructive"
          className="w-full mt-3 bg-red-500"
          onClick={deleteAccount}
        >
          Delete My Account
        </Button>
      </div>
    </>
  );
};

export default ManageAccount;
