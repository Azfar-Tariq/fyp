// import { useEffect, useState } from "react";
// import ManualRequestCard from "../components/MannualControl/ManualRequestCard";
// import { toast } from "react-toastify";
// import { MaterialSymbolsEditOutlineRounded } from "../assets/icons/edit";
// import { MaterialSymbolsDelete } from "../assets/icons/delete";
// import Axios from "axios";
// import { MaterialSymbolsAddRounded } from "../assets/icons/add";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [manualControlRequests, setManualControlRequests] = useState([]);

//   useEffect(() => {
//     // Fetch users
//     fetch("http://localhost:3001/users") // Replace with your actual API endpoint
//       .then((response) => response.json())
//       .then((data) => setUsers(data));

//     // Fetch manual control requests
//     Axios.get("http://localhost:3001/manual-control-requests")
//       .then((response) => setManualControlRequests(response.data))
//       .catch((error) =>
//         console.error("Failed to fetch manual control requests:", error)
//       );
//   }, []);

//   const handleGrantRequest = async (requestId) => {
//     try {
//       // Code for granting manual control request
//       await Axios.put(
//         `http://localhost:3001/grant-manual-control/${requestId}`
//       );

//       // Remove the granted request from the list
//       setManualControlRequests(
//         manualControlRequests.filter((request) => request.id !== requestId)
//       );

//       // Display success toast notification
//       toast.success("Manual control request granted!");
//     } catch (error) {
//       // Display error toast notification if request fails
//       toast.error("Failed to grant request. Please try again.");
//       console.error("Error granting manual control request:", error);
//     }
//   };

//   const handleDenyRequest = async (requestId) => {
//     try {
//       // Code for denying manual control request
//       await Axios.put(`http://localhost:3001/deny-manual-control/${requestId}`);

//       // Remove the denied request from the list
//       setManualControlRequests(
//         manualControlRequests.filter((request) => request.id !== requestId)
//       );

//       // Display success toast notification
//       toast.success("Manual control request denied!");
//     } catch (error) {
//       // Display error toast notification if request fails
//       toast.error("Failed to deny request. Please try again.");
//       console.error("Error denying manual control request:", error);
//     }
//   };

//   return (
//     <div className="col-span-4 p-6 bg-primary">
//       <section className="body-font">
//         <div className="container px-5 py-5 mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {users.map((user, index) => (
//               <div
//                 key={index}
//                 className="p-4 rounded-lg shadow bg-background text-white"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <h2 className="text-lg font-bold">{user.name}</h2>
//                     <p className="text-sm">{user.email}</p>
//                   </div>
//                   <div className="flex items-center">
//                     <span
//                       className={
//                         user.logged_in
//                           ? "bg-green-500 w-3 h-3 rounded-full mr-1"
//                           : "bg-red-500 w-3 h-3 rounded-full mr-1"
//                       }
//                     ></span>
//                     <span className="text-xs">
//                       {user.logged_in ? "Online" : "Offline"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex flex-col gap-2">
//                     <span className="text-sm mr-2">Status:</span>
//                     <span className="text-sm font-bold">
//                       {user.status ? "" : "No Request"}
//                     </span>
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <span className="text-sm mr-2">Last Updated:</span>
//                     <span className="text-sm">
//                       {user.last_updated ? (
//                         ""
//                       ) : (
//                         <p className="text-xs text-white">
//                           {new Date().toLocaleString()}
//                         </p>
//                       )}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="mt-4 gap-2 flex justify-end items-center text-icon">
//                   <button className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
//                     <MaterialSymbolsEditOutlineRounded />
//                     Edit
//                   </button>
//                   <button className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
//                     <MaterialSymbolsDelete />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//             <div className="bg-background text-white flex justify-center items-center m-16 mx-24 p-4 rounded-lg shadow">
//               <div className="flex justify-center items-center">
//                 <MaterialSymbolsAddRounded />
//                 <h2 className="text-lg font-bold ml-2">Add User</h2>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

     
//     </div>
//   );
// };

// export default Users;
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { MaterialSymbolsEditOutlineRounded } from "../assets/icons/edit";
import { MaterialSymbolsDelete } from "../assets/icons/delete";
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

  // Function to check if a user has requested manual control
  const hasRequestedManualControl = (userId) => {
    return manualControlRequests.some((request) => request.userId === userId);
  };

  return (
    <div className="col-span-4 p-6 bg-primary">
      <section className="body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Display users who have requested manual control */}
            {users
              .filter((user) => hasRequestedManualControl(user.id))
              .map((user, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg shadow bg-background text-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-bold">{user.name}</h2>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={
                          user.logged_in
                            ? "bg-green-500 w-3 h-3 rounded-full mr-1"
                            : "bg-red-500 w-3 h-3 rounded-full mr-1"
                        }
                      ></span>
                      <span className="text-xs">
                        {user.logged_in ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm mr-2">Status:</span>
                      <span className="text-sm font-bold">
                        {user.status ? "" : "No Request"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm mr-2">Last Updated:</span>
                      <span className="text-sm">
                        {user.last_updated ? (
                          ""
                        ) : (
                          <p className="text-xs text-white">
                            {new Date().toLocaleString()}
                          </p>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 gap-2 flex justify-end items-center text-icon">
                    <button className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
                      <MaterialSymbolsEditOutlineRounded />
                      Edit
                    </button>
                    <button className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
                      <MaterialSymbolsDelete />
                      Delete
                    </button>
                  </div>
                </div>
              ))}

            {/* Display other users */}
            {users
              .filter((user) => !hasRequestedManualControl(user.id))
              .map((user, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg shadow bg-background text-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-bold">{user.name}</h2>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={
                          user.logged_in
                            ? "bg-green-500 w-3 h-3 rounded-full mr-1"
                            : "bg-red-500 w-3 h-3 rounded-full mr-1"
                        }
                      ></span>
                      <span className="text-xs">
                        {user.logged_in ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm mr-2">Status:</span>
                      <span className="text-sm font-bold">
                        {user.status ? "" : "No Request"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm mr-2">Last Updated:</span>
                      <span className="text-sm">
                        {user.last_updated ? (
                          ""
                        ) : (
                          <p className="text-xs text-white">
                            {new Date().toLocaleString()}
                          </p>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 gap-2 flex justify-end items-center text-icon">
                    <button className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
                      <MaterialSymbolsEditOutlineRounded />
                      Edit
                    </button>
                    <button className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black">
                      <MaterialSymbolsDelete />
                      Delete
                    </button>
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
