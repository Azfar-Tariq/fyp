import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [user, setUser] = useState(null);

  const get = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        console.error("Email not found in local storage");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/user-details?email=${email}`,
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
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    const email = localStorage.getItem("email");

    try {
      const response = await fetch("http://localhost:3001/logout", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      localStorage.removeItem("email");
      navigate("/"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    get();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Name:</label>
          <p className="p-2 border rounded bg-gray-100">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Email:</label>
          <p className="p-2 border rounded bg-gray-100">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Role:</label>
          <p className="p-2 border rounded bg-gray-100">{user.role}</p>
        </div>
        <button
          className="bg-red-500 text-white p-2 rounded w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
