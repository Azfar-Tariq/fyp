import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const get = async () => {
    try {
      // Get the email from local storage
      const email = localStorage.getItem("email");

      // Check if email exists
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
      setLoading(true);
    // Delay navigation to simulate loading process
    setTimeout(() => {
    setLoading(false); 
      navigate("/userLogin");
    }, 1000);
     
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    get();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-10 text-2xl font-bold ">
       {/*display loader after sccueeful logout*/}
       {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-50">

          <ClipLoader color={"#36d7b7"} loading={loading} size={150} />
        </div>
      )}
      <h1>Profile</h1>
      <div className="flex justify-center mt-20">
        <div className="max-w-xs">
          <div className="bg-white drop-shadow-2xl rounded-lg p-3">
            <div className="photo-wrapper p-2">
              <img
                className="w-32 h-32 rounded-full mx-auto bg-slate-600"
                src="" // Add user image
              />
            </div>
            <div className="p-2">
              <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
                {user.name}
              </h3>
              <div className="text-center text-gray-400 text-xs font-semibold">
                <p>{user.role}</p>
              </div>
              <table className="text-xs my-3">
                <tbody>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">
                      Email
                    </td>
                    <td className="px-2 py-2">{user.email}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">
                      Phone
                    </td>
                    {/* Add user number */}
                    <td className="px-2 py-2">+921234567890</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-center my-3">
                <button
                  className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 hover:scale-105 transition ease-in-out rounded text-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
