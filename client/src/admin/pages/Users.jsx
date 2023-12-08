import Header from "../components/Header";
// import { MaterialSymbolsNotifications } from "../assets/icons/notification"; // Import the notification icon
import { useEffect, useState } from "react";
import ManualRequestCard from "../components/MannualRequestCard"; // Import the new component
import { toast } from "react-toastify";
import { Axios } from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [manualControlRequests, setManualControlRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/users") // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setUsers(data));

      Axios.get("http://localhost:3001/manual-control-requests")
      .then((response) => setManualControlRequests(response.data))
      .catch((error) => console.error("Failed to get manual control requests:", error));
  }, []);

  const handleGrantRequest = async (requestId) => {
    try {
      await Axios.put(`http://localhost:3001/grant-manual-control/${requestId}`);
      toast.success("Manual control request granted!");

      // Update the list of manual control requests after granting
      const updatedRequests = manualControlRequests.filter((request) => request.id !== requestId);
      setManualControlRequests(updatedRequests);
    } catch (error) {
      console.error("Error granting manual control request:", error);
      toast.error("Failed to grant request. Please try again.");
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      await Axios.put(`http://localhost:3001/deny-manual-control/${requestId}`);
      toast.success("Manual control request denied!");

      // Update the list of manual control requests after denying
      const updatedRequests = manualControlRequests.filter((request) => request.id !== requestId);
      setManualControlRequests(updatedRequests);
    } catch (error) {
      console.error("Error denying manual control request:", error);
      toast.error("Failed to deny request. Please try again.");
    }
  };

  return (
    <div className="col-span-4">
      <Header title="Users" />
      {manualControlRequests.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Manual Control Requests</h2>
          <ul>
            {/* Manual Control Requests */}
      {manualControlRequests.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Manual Control Requests</h2>
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
          </ul>
        </div>
      )}
      <ul className="flex flex-col space-y-4 list-none">
        {users.map((user) => (
          <li key={user.email} className="flex items-center space-x-4">
            <span className={user.logged_in ? "online" : "offline"}></span>
            <span className="font-semibold">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;