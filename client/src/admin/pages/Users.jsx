import { useEffect, useState } from "react";
import ManualRequestCard from "../components/MannualControl/ManualRequestCard";
import { toast } from "react-toastify";
import Axios from "axios";
import { MaterialSymbolsAddRounded } from "../assets/icons/add";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [manualControlRequests, setManualControlRequests] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch("http://localhost:3001/users") // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setUsers(data));

    // Fetch manual control requests
    Axios.get("http://localhost:3001/manual-control-requests")
      .then((response) => setManualControlRequests(response.data))
      .catch((error) =>
        console.error("Failed to fetch manual control requests:", error)
      );
  }, []);

  const handleGrantRequest = async (requestId) => {
    try {
      // Code for granting manual control request
      await Axios.put(
        `http://localhost:3001/grant-manual-control/${requestId}`
      );

      // Remove the granted request from the list
      setManualControlRequests(
        manualControlRequests.filter((request) => request.id !== requestId)
      );

      // Display success toast notification
      toast.success("Manual control request granted!");
    } catch (error) {
      // Display error toast notification if request fails
      toast.error("Failed to grant request. Please try again.");
      console.error("Error granting manual control request:", error);
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      // Code for denying manual control request
      await Axios.put(`http://localhost:3001/deny-manual-control/${requestId}`);

      // Remove the denied request from the list
      setManualControlRequests(
        manualControlRequests.filter((request) => request.id !== requestId)
      );

      // Display success toast notification
      toast.success("Manual control request denied!");
    } catch (error) {
      // Display error toast notification if request fails
      toast.error("Failed to deny request. Please try again.");
      console.error("Error denying manual control request:", error);
    }
  };

  return (
    <div className="col-span-4 p-6">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="flex flex-wrap -m-2">
            {users.map((user, index) => (
              <div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex bg-white items-center border-gray-200 border p-4 rounded-lg shadow">
                  <img
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    src="https://dummyimage.com/80x80"
                  />
                  <div className="flex-grow">
                    <h2 className="text-gray-900 title-font font-medium">
                      {user.name}
                    </h2>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <span
                    className={
                      user.logged_in
                        ? "bg-green-500 w-3 h-3 rounded-full"
                        : "bg-red-500 w-3 h-3 rounded-full"
                    }
                  ></span>
                </div>
              </div>
            ))}
            <div className=" p-2 lg:w-1/3 md:w-1/2 w-full">
              <div className=" bg-white h-full flex items-center border-gray-200 border p-4 rounded-lg shadow hover:bg-gray-100">
                <div className="mr-4">
                  <MaterialSymbolsAddRounded />
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 title-font font-medium">
                    Add More Users
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Control Requests */}
      {manualControlRequests.length > 0 && (
        <div className="mb-4 mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Manual Control Requests</h2>
          <ul>
            {manualControlRequests.map((request) => (
              <ManualRequestCard
                key={request.id}
                request={request}
                onGrant={handleGrantRequest}
                onDeny={handleDenyRequest}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Users;
