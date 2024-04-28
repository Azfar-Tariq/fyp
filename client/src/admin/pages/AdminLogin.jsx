import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iot from "../assets/images/iot1.jpg";
import ClipLoader from "react-spinners/ClipLoader";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);



//.......................................Login Admin.................................................

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/adminLogin", {
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
            const dashboardRoute = "/admin";
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
      alert("An unexpected error occurred");
    }
  };
  const handleUserLogin = () => {
    
    setLoading(true);
    // Delay navigation to simulate loading process
    setTimeout(() => {
    setLoading(false); // Set loading to false after 5 seconds
      navigate("/userLogin");
    }, 1000);
   
  };

  return (
    <div className="flex h-screen w-full">
      {/*display loader after sccueeful login*/}
      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-50">

          <ClipLoader color={"#36d7b7"} loading={loading} size={150} />
        </div>
      )}
    {/* Left Div */}
    <div className="pt-32 bg-white px-28">
      <h2 className="text-black font-bold text-4xl font-mono mb-4">LOGIN</h2>
      <p className="text-gray-500 font-mono mb-4">Welcome to IoT based Electricity <br></br>Conservation System</p>
      <div className="mb-4">
        <label className="block text-gray-700 text-lg font-bold font-mono mt-16 mb-2" htmlFor="email">
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
        <label className="block text-gray-700 text-lg font-mono font-bold mb-2" htmlFor="password">
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
      <button className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-mono font-bold w-96 py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button"
      onClick={handleLogin}
      >
        LogIn
      </button>
      <div className="mt-4 flex justify-center">
        <button className="text-gray-500 font-mono underline" onClick={handleUserLogin}>
          Login as User
        </button>
      </div>
    </div>
    {/* Right Div */}
    <div className="bg-black flex-grow">  <img src={iot} alt="Background" className="w-full h-full object-cover" />
    </div>
  </div>
   
  );

};

export default AdminLogin;


 