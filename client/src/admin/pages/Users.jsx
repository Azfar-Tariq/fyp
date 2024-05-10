import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MaterialSymbolsEditOutlineRounded } from "../assets/icons/edit";
import { MaterialSymbolsDelete } from "../assets/icons/delete";
import Axios from "axios";
import { MaterialSymbolsAddRounded } from "../assets/icons/add";

const Users = () => {
  const [users, setUsers] = useState([]);
  // const [manualControlRequests, setManualControlRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    employeeID: "",
    phone: "",
  });

  const openModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
    if (Object.keys(data).length === 0) {
      setIsNewUser(true);
      setNewUser({
        email: "",
        password: "",
        name: "",
        role: "",
        employeeID: "",
        phone: "",
      });
    } else {
      setIsNewUser(false);
      setNewUser({
        email: data.email,
        password: "", // Assuming password is not editable
        name: data.name,
        role: data.role,
        employeeID: data.employeeID,
        phone: data.phone,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({});
    setNewUser({
      email: "",
      password: "",
      name: "",
      role: "",
      employeeID: "",
      phone: "",
    });
  };

  const addUser = async (userData) => {
    try {
      await Axios.post("http://localhost:3001/addUser", userData);
      fetchUsers();
      toast.success("User added successfully!");
      setNewUser({
        email: "",
        password: "",
        name: "",
        role: "",
        employeeID: "",
        phone: "",
      });
    } catch (error) {
      toast.error("Failed to add user. Please try again.");
      console.error("Error adding user:", error);
    }
  };

  const editUser = async (userId, userData) => {
    try {
      await Axios.put(`http://localhost:3001/editUser/${userId}`, userData);
      fetchUsers();
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
      console.error("Error updating user:", error);
    }
  };

  const removeUser = async (userId) => {
    try {
      await Axios.delete(`http://localhost:3001/removeUser/${userId}`);
      fetchUsers();
      toast.success("User removed successfully!");
    } catch (error) {
      toast.error("Failed to remove user. Please try again.");
      console.error("Error removing user:", error);
    }
  };

  const fetchUsers = () => {
    Axios.get("http://localhost:3001/users")
      .then((response) => {
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();

    // Fetch manual control requests
    // Axios.get("http://localhost:3001/manual-control-requests")
    //   .then((response) => setManualControlRequests(response.data))
    //   .catch((error) =>
    //     console.error("Failed to fetch manual control requests:", error)
    //   );
  }, []);

  // const handleGrantRequest = async (requestId) => {
  //   try {
  //     // Code for granting manual control request
  //     await Axios.put(
  //       `http://localhost:3001/grant-manual-control/${requestId}`
  //     );

  //     // Remove the granted request from the list
  //     setManualControlRequests(
  //       manualControlRequests.filter((request) => request.id !== requestId)
  //     );

  //     // Display success toast notification
  //     toast.success("Manual control request granted!");
  //   } catch (error) {
  //     // Display error toast notification if request fails
  //     toast.error("Failed to grant request. Please try again.");
  //     console.error("Error granting manual control request:", error);
  //   }
  // };

  // const handleDenyRequest = async (requestId) => {
  //   try {
  //     // Code for denying manual control request
  //     await Axios.put(`http://localhost:3001/deny-manual-control/${requestId}`);

  //     // Remove the denied request from the list
  //     setManualControlRequests(
  //       manualControlRequests.filter((request) => request.id !== requestId)
  //     );

  //     // Display success toast notification
  //     toast.success("Manual control request denied!");
  //   } catch (error) {
  //     // Display error toast notification if request fails
  //     toast.error("Failed to deny request. Please try again.");
  //     console.error("Error denying manual control request:", error);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isNewUser ? addUser(newUser) : editUser(modalData.id, newUser);
    closeModal();
  };

  return (
    <div className="col-span-4 p-6 bg-primary">
      <section className="body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
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
                  <button
                    className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black"
                    onClick={() => {
                      setIsNewUser(false);
                      openModal(user);
                    }}
                  >
                    <MaterialSymbolsEditOutlineRounded />
                    Edit
                  </button>
                  <button
                    className="p-2 gap-2 flex rounded-lg duration-150 hover:bg-icon hover:text-black"
                    onClick={() => removeUser(user.id)}
                  >
                    <MaterialSymbolsDelete />
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div
              className="bg-background hover:bg-icon text-white hover:text-black flex justify-center items-center m-16 mx-24 p-4 rounded-lg shadow hover:cursor-pointer duration-150"
              onClick={() => {
                setIsNewUser(true);
                openModal({});
              }}
            >
              <div className="flex justify-center items-center">
                <MaterialSymbolsAddRounded />
                <h2 className="text-lg font-bold ml-2">Add User</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white p-6 rounded-lg z-10 flex flex-col w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {isNewUser ? "Add User" : "Edit User"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Email"
                  className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:border-blue-500"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Password"
                  className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:border-blue-500"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:border-blue-500"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="Role"
                className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:border-blue-500"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Employee ID"
                  className="col-span-1 border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:border-blue-500"
                  name="employeeID"
                  value={newUser.employeeID}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="col-span-2 border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:border-blue-500"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="border border-black px-3 py-2 rounded-lg duration-150"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white ml-3 px-3 py-2 rounded-lg duration-150 hover:bg-opacity-80"
                >
                  {isNewUser ? "Add User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
