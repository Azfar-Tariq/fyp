import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import AdminImage from "../assets/images/profile.png";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAdminProfile = async () => {
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
        setLoading(false); // Set loading to false after 1 second
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center mt-20">
      {loading && (
        <div className="fixed w-full h-full flex justify-center items-center z-50">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      )}
      <div className="w-[20rem] bg-background text-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col font-bold text-xl items-center mb-2">
            Admin Profile
          </div>
          <div className="flex flex-col items-center">
            {/* Admin Profile Image Placeholder */}
            <div
              className="w-40 rounded-full h-40 bg-cover bg-center m-4"
              style={{ backgroundImage: `url(${AdminImage})` }}
            ></div>
          </div>
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="font-semibold">Employee ID:</span>{" "}
              {admin.admin_employeeID}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {admin.admin_name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span> {admin.admin_email}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Phone Number:</span>{" "}
              {admin.admin_phone}
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          {/* Logout Button */}
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md w-full hover:bg-white hover:text-red-500 transition duration-300"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
