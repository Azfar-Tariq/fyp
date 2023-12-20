import Header from "../components/Header";
import { useEffect, useState } from "react";
import ManualRequestCard from "../components/ManualRequestCard";
import { toast } from "react-toastify";
import Axios from "axios";

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
      // Send a request to the backend to grant manual control
      await Axios.put(
        `http://localhost:3001/grant-manual-control/${requestId}`
      );

      // Remove the granted request from the list
      setManualControlRequests(
        manualControlRequests.filter((request) => request.id !== requestId)
      );

      toast.success("Manual control request granted!");
    } catch (error) {
      console.error("Error granting manual control request:", error);
      toast.error("Failed to grant request. Please try again.");
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      // Send a request to the backend to deny manual control
      await Axios.put(`http://localhost:3001/deny-manual-control/${requestId}`);

      // Remove the denied request from the list
      setManualControlRequests(
        manualControlRequests.filter((request) => request.id !== requestId)
      );

      toast.success("Manual control request denied!");
    } catch (error) {
      console.error("Error denying manual control request:", error);
      toast.error("Failed to deny request. Please try again.");
    }
  };

  return (
    <div className="col-span-4 p-6 bg-gray-100">
      <Header title="Users" />

      <ul className="flex flex-col space-y-4 list-none">
        {users.map((user) => (
          <li
            key={user.email}
            className="flex items-center space-x-4 p-2 bg-white rounded shadow"
          >
            <span
              className={
                user.logged_in
                  ? "bg-green-500 w-3 h-3 rounded-full"
                  : "bg-red-500 w-3 h-3 rounded-full"
              }
            ></span>
            <span className="font-semibold">{user.name}</span>
          </li>
        ))}
      </ul>

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
