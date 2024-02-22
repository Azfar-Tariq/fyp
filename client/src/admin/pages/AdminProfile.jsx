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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2 sm:py-12">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <div className="flex-none lg:flex">
          <div className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
            <img src="" alt="" className="w-full h-full object-cover" /> {/* Add user image */}
          </div>
          <div className="flex-auto bg-white p-6 rounded-b lg:rounded-b-none lg:rounded-r">
            <div className="flex flex-wrap">
              <h1 className="flex-auto text-xl font-semibold">{user.name}</h1>
              <div className="text-xl font-semibold text-gray-500">{user.role}</div>
              {/* <div className="w-full flex-none text-sm font-medium text-gray-500 mt-2">
                Last login: {user.lastLogin}
              </div> */}
            </div>
            <div className=" w-full flex items-baseline mt-4 mb-6 text-gray-700">
              <div className="space-x-2 flex">
                <label>Email:</label>
                <p className="">{user.email}</p>
              </div>
              <div className="space-x-2 flex">
                <label>Phone:</label>
                <p className="">+921234567890</p> {/* Add user number */}
              </div>
            </div>
            <div className="flex space-x-3 mb-4 text-sm font-medium">
              <div className="flex-auto flex space-x-3">
                <button className="w-1/2 flex items-center justify-center rounded-md bg-black text-white" type="submit" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
