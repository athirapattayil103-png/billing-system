import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await axios.get("http://localhost:3000/admin");

    const admin = res.data.find(
      (a) => a.email === email && a.password === password
    );

    if (!admin) {
      toast.error("Invalid login ❌");
      return;
    }

    localStorage.setItem("admin", JSON.stringify(admin));

    toast.success("Login success ✅");

    navigate("/app/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600">
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;