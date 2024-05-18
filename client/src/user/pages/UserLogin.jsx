import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iot from "../assets/images/loginimg.jpg";
import ClipLoader from "react-spinners/ClipLoader";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //.......................................Login User.................................................
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
          setLoading(true);

          // Delay navigation to simulate loading process
          setTimeout(() => {
            setLoading(false); // Set loading to false after 5 seconds
            const dashboardRoute = "/user";
            navigate(dashboardRoute); // Navigate to the user dashboard
          }, 3000);
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
      alert("Wrong Email or Password");
    }
  };
  const handleUserLogin = () => {
    setLoading(true);
    // Delay navigation to simulate loading process
    setTimeout(() => {
      setLoading(false); // Set loading to false after 5 seconds
      navigate("/");
    }, 1000);
  };
  return (
    <div className="relative flex h-screen w-full">
      {/*display loader after sccueeful login*/}
      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-50">
          <ClipLoader color={"#36d7b7"} loading={loading} size={150} />
        </div>
      )}
      {/* Left Div */}
      <div className="bg-black flex-grow">
        {" "}
        <img
          src={iot}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Right Div */}
      <div className="pt-32 bg-white px-28 relative z-10">
        <h2 className="text-black font-bold text-4xl font-mono mb-4">LOGIN</h2>
        <p className="text-gray-500 font-mono mb-4">
          Welcome to IoT based Electricity <br />
          Conservation System
        </p>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-lg font-bold font-mono mt-16 mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-black focus:shadow-outline"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-lg font-mono font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:border-black focus:shadow-outline"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="***********"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-mono font-bold w-96 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleLogin}
        >
          LogIn
        </button>
        <div className="mt-4 flex justify-center">
          <button
            className="text-gray-500 font-mono underline"
            onClick={handleUserLogin}
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

// <section className="h-screen flex justify-center items-center bg-cover bg-center relative" style={{ backgroundImage: `url(${iot})` }}>
//   <div className="container h-full z-10">
//     <div className="flex h-full flex-wrap items-center justify-center">
//       <div className="md:w-8/12 lg:ml-6 lg:w-96 backdrop-blur-2xl shadow-md rounded-md p-8 border border-white bg-opacity-90">
//         <h2 className="flex justify-center text-3xl font-bold mb-8 text-white">
//           Welcome Back!!!
//         </h2>
//         <div className="mb-6">
//           <input
//             type="email"
//             className="w-full p-4 rounded-lg border border-white focus:outline-none focus:border-black bg-transparent text-white placeholder-gray-400"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//           />
//         </div>
//         <div className="mb-6">
//           <input
//             type="password"
//             className="w-full p-4 rounded-lg border border-white focus:outline-none focus:border-black bg-transparent text-white placeholder-gray-400"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//           />
//         </div>
//         <button
//           className="bg-white text-black p-4 rounded-lg w-full hover:bg-gray-300 transition duration-300 ease-in-out"
//           onClick={handleLogin}
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   </div>
// </section>
