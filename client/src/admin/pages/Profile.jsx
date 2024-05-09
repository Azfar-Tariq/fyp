import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSignOutAlt,
  faEye,
  faEyeSlash,
  faIdBadge,
  faUser,
  faEnvelope,
  faPhone,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const get = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        console.error("Email not found in local storage");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/admin-details?email=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAdmin(data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleLogout = async () => {
    const email = localStorage.getItem("email");

    try {
      const response = await fetch("http://localhost:3001/adminLogout", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      localStorage.removeItem("email");
      setLoading(true);
      // Delay navigation to simulate loading process
      setTimeout(() => {
        setLoading(false); // Set loading to false after 5 seconds
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    get();
  }, []);

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto bg-primary text-black rounded-md shadow-md">
      {/* Loader component */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      )}

      {/* Personal Information Section */}
      <div className="mb-8 bg-background border border-gray-200 rounded-md m-14 p-12">
        <h2 className="text-xl text-white font-semibold border-b-2 border-gray-400 mb-4">
          Personal Information
        </h2>
        {/* Employee ID */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Employee ID</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md p-2">
            <div className="mr-2 flex items-center justify-center bg-black text-white rounded-md w-8 h-8">
              <FontAwesomeIcon icon={faIdBadge} />
            </div>
            <span>{admin.admin_employeeID}</span>
          </div>
        </div>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Name</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md p-2">
            <div className="mr-2 flex items-center justify-center bg-black text-white rounded-md w-8 h-8">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span>{admin.admin_name}</span>
          </div>
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Email</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md p-2">
            <div className="mr-2 flex items-center justify-center bg-black text-white rounded-md w-8 h-8">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <span>{admin.admin_email}</span>
          </div>
        </div>
        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Phone Number</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md p-2">
            <div className="mr-2 flex items-center justify-center bg-black text-white rounded-md w-8 h-8">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <span>{admin.admin_phone}</span>
          </div>
        </div>
      </div>

      {/* Security & Settings Section */}
      <div className="mb-8 bg-background border border-gray-200 rounded-md m-14 p-12">
        <h2 className="text-xl text-white border-b-2 border-gray-400 font-semibold mb-4">
          Settings
        </h2>
        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Password</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md p-2">
            <div className="mr-2 flex items-center justify-center bg-black text-white rounded-md w-8 h-8">
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value="********"
              readOnly
              className="border-none focus:outline-none flex-grow text-gray-700 bg-transparent"
            />
          </div>
        </div>
        {/* Role */}
        <div>
          <label className="block text-gray-200 mb-2">Role</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md p-2">
            <div className="mr-2 flex items-center justify-center bg-black text-white rounded-md w-8 h-8">
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            <span>{admin.admin_role}</span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex justify-end m-8 p-8 mb-0">
        {/* Edit Profile Button */}
        <button className="bg-effect text-white px-4 py-2 rounded-md mr-4 hover:bg-white hover:text-black transition duration-300">
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Edit Profile
        </button>
        {/* Logout Button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-white hover:text-red-500 transition duration-300"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
