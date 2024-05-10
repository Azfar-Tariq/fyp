import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MaterialSymbolsEditOutlineRounded } from "../assets/icons/edit";
import { MaterialSymbolsDelete } from "../assets/icons/delete";
import Axios from "axios";
import { MaterialSymbolsAddRounded } from "../assets/icons/add";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [manualControlRequests, setManualControlRequests] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchManualControlRequests = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/manual-control-requests");
        setManualControlRequests(response.data);
      } catch (error) {
        console.error("Error fetching manual control requests:", error);
      }
    };

    fetchUsers();
    fetchManualControlRequests();
  }, []);

  const handleGrantRequest = async (requestId) => {
    try {
      await Axios.put(`http://localhost:3001/grant-manual-control/${requestId}`);
      setManualControlRequests(manualControlRequests.filter((request) => request.id !== requestId));
      toast.success("Manual control request granted!");
    } catch (error) {
      toast.error("Failed to grant request. Please try again.");
      console.error("Error granting manual control request:", error);
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      await Axios.put(`http://localhost:3001/deny-manual-control/${requestId}`);
      setManualControlRequests(manualControlRequests.filter((request) => request.id !== requestId));
      toast.success("Manual control request denied!");
    } catch (error) {
      toast.error("Failed to deny request. Please try again.");
      console.error("Error denying manual control request:", error);
    }
  };

  return (
    <div className="col-span-4 p-6 bg-primary">
      <section className="body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <div key={index} className="p-4 rounded-lg shadow bg-background text-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-bold">{user.name}</h2>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={user.logged_in ? "bg-green-500 w-3 h-3 rounded-full mr-1" : "bg-red-500 w-3 h-3 rounded-full mr-1"}></span>
                    <span className="text-xs">{user.logged_in ? "Online" : "Offline"}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm mr-2">Status:</span>
                    <span className="text-sm font-bold">{user.status ? "" : "No Request"}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm mr-2">Last Updated:</span>
                    <span className="text-sm">
                      {user.last_updated ? "" : <p className="text-xs text-white">{new Date().toLocaleString()}</p>}
                    </span>
                  </div>
                </div>
                <div className="mt-4 gap-2 flex justify-end items-center text-icon">
                  {manualControlRequests.some((request) => request.userId === user.id) && (
                    <>
                      <button onClick={() => handleGrantRequest(user.id)} className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
                        <MaterialSymbolsEditOutlineRounded />
                        Grant
                      </button>
                      <button onClick={() => handleDenyRequest(user.id)} className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
                        <MaterialSymbolsDelete />
                        Deny
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div className="bg-background text-white flex justify-center items-center m-16 mx-24 p-4 rounded-lg shadow">
              <div className="flex justify-center items-center">
                <MaterialSymbolsAddRounded />
                <h2 className="text-lg font-bold ml-2">Add User</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Users;
