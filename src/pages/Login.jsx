// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Enter all fields ❌");
//       return;
//     }

//     try {
//       setLoading(true);

// const res = await axios.get("https://billing-system-zykh.onrender.com/admin");
//       const admin = res.data.find(
//         (a) => a.email === email && a.password === password
//       );

//       if (!admin) {
//         toast.error("Invalid login ❌");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("admin", JSON.stringify(admin));

//       toast.success("Welcome 👋");

//       navigate("/app/dashboard");

//     } catch (err) {
//       toast.error("Server error ⚠️");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">

//       <div className="bg-white p-8 rounded-2xl shadow-xl w-80">

//         {/* TITLE */}
//         <h2 className="text-2xl font-bold text-center mb-2">
//           Welcome 👋
//         </h2>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           Login to your dashboard
//         </p>

//         {/* FORM */}
//         <form onSubmit={handleLogin} className="space-y-4">

//           <input
//             type="email"
//             placeholder="Enter email"
//             className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Enter password"
//             className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             disabled={loading}
//             className={`w-full py-2 rounded-lg text-white font-semibold transition ${
//               loading
//                 ? "bg-gray-400"
//                 : "bg-blue-500 hover:bg-green-500"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//         </form>

//         {/* FOOTER */}
//         <p className="text-xs text-gray-400 text-center mt-4">
//           Secure Admin Access 🔒
//         </p>

//       </div>

//     </div>
//   );
// };

// export default Login;



import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ BASE URL (single source of truth)
const BASE_URL = "https://billing-system-zykh.onrender.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter all fields ❌");
      return;
    }

    try {
      setLoading(true);

      // ✅ CORRECT API CALL
      const res = await axios.get(`${BASE_URL}/admin`);

      const admin = res.data.find(
        (a) => a.email === email && a.password === password
      );

      if (!admin) {
        toast.error("Invalid login ❌");
        return;
      }

      // ✅ SAVE LOGIN
      localStorage.setItem("admin", JSON.stringify(admin));

      toast.success("Welcome 👋");

      navigate("/app/dashboard");

    } catch (err) {
      console.error(err); // 👈 debug help
      toast.error("Server error ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome 👋
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your dashboard
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-green-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Secure Admin Access 🔒
        </p>

      </div>

    </div>
  );
};

export default Login;