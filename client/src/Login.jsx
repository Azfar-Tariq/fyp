import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iot from "./admin/background.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if the response has the expected 'role' property
        if (data.role) {
          localStorage.setItem("email", email);
          // Successful login, navigate to the appropriate dashboard
          const dashboardRoute = data.role === "Admin" ? "/admin" : "/user";
          navigate(dashboardRoute);
        } else {
          console.error("Role not found in server response:", data);
          alert("Role not found in server response");
        }
      } else {
        // Display error message
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <section className="h-screen flex justify-center items-center bg-cover bg-center relative" style={{ backgroundImage: `url(${iot})` }}>
      <div className="container h-full z-10">
        <div className="flex h-full flex-wrap items-center justify-center">
          <div className="md:w-8/12 lg:ml-6 lg:w-96 backdrop-blur-2xl shadow-md rounded-md p-8 border border-white bg-opacity-90">
            <h2 className="flex justify-center text-3xl font-bold mb-8 text-white">
              Welcome Back!!!
            </h2>
            <div className="mb-6">
              <input
                type="email"
                className="w-full p-4 rounded-lg border border-white focus:outline-none focus:border-black bg-transparent text-white placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                className="w-full p-4 rounded-lg border border-white focus:outline-none focus:border-black bg-transparent text-white placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button
              className="bg-white text-black p-4 rounded-lg w-full hover:bg-gray-300 transition duration-300 ease-in-out"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

// <div className="h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md p-4 bg-white rounded shadow-md">
//         <img src="iot-image.png" className="w-48 mx-auto mb-4" />
//         <form>
//           <label className="block mb-2">
//             <span className="text-gray-700">Username</span>
//             <input
//               type="text"
//               className="block w-full p-2 pl-10 text-sm text-gray-700"
//                value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               placeholder="Username"
//             />
//           </label>
//           <label className="block mb-2">
//             <span className="text-gray-700">Password</span>
//             <input
//               type="password"
//               className="block w-full p-2 pl-10 text-sm text-gray-700"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//             />
//           </label>
//           <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
//           onClick={handleLogin}>
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
