// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState(null);

//   const get = async () => {
//     try {
//       const email = localStorage.getItem("email");

//       if (!email) {
//         console.error("Email not found in local storage");
//         return;
//       }

//       const response = await fetch(
//         `http://localhost:3001/user-details?email=${email}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       setUser(data);
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };
//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     const email = localStorage.getItem("email");

//     try {
//       const response = await fetch("http://localhost:3001/logout", {
//         method: "POST",
//         body: JSON.stringify({ email }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       localStorage.removeItem("email");
//       navigate("/"); // Redirect to the login page after logout
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   useEffect(() => {
//     get();
//   }, []);

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-white border border-blue-400 shadow-lg rounded-lg p-8 w-96">
//         <h2 className="text-2xl font-semibold text-center mb-6">User Profile</h2>
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-600 mb-2">Name:</label>
//           <div className="bg-gray-100 border border-gray-300 rounded-md p-2">{user.name}</div>
//         </div>
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-600 mb-2">Role:</label>
//           <div className="bg-gray-100 border border-gray-300 rounded-md p-2">{user.role}</div>
//         </div>
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-600 mb-2">Employee ID:</label>
//           <div className="bg-gray-100 border border-gray-300 rounded-md p-2">{user.employeeId}</div>
//         </div>
//         <div className="flex flex-col mb-4">
//           <label className="text-gray-600 mb-2">Contact Number:</label>
//           <div className="bg-gray-100 border border-gray-300 rounded-md p-2">{user.contactNumber}</div>
//         </div>
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//     // <div className="p-10 text-2xl font-bold ">
//     //   <h1>Profile</h1>
//     //   <div className="flex justify-center mt-20">
//     //     <div className="max-w-xs">
//     //       <div className="bg-white drop-shadow-2xl rounded-lg p-3">
//     //         <div className="photo-wrapper p-2">
//     //           <img
//     //             className="w-32 h-32 rounded-full mx-auto bg-slate-600"
//     //             src="" // Add user image
//     //           />
//     //         </div>
//     //         <div className="p-2">
//     //           <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
//     //             {user.name}
//     //           </h3>
//     //           <div className="text-center text-gray-400 text-xs font-semibold">
//     //             <p>{user.role}</p>
//     //           </div>
//     //           <table className="text-xs my-3">
//     //             <tbody>
//     //               <tr>
//     //                 <td className="px-2 py-2 text-gray-500 font-semibold">
//     //                   Email
//     //                 </td>
//     //                 <td className="px-2 py-2">{user.email}</td>
//     //               </tr>
//     //               <tr>
//     //                 <td className="px-2 py-2 text-gray-500 font-semibold">
//     //                   Phone
//     //                 </td>
//     //                 {/* Add user number */}
//     //                 <td className="px-2 py-2">+921234567890</td>
//     //               </tr>
//     //             </tbody>
//     //           </table>
//     //           <div className="text-center my-3">
//     //             <button
//     //               className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 hover:scale-105 transition ease-in-out rounded text-lg"
//     //               onClick={handleLogout}
//     //             >
//     //               Logout
//     //             </button>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
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
    <div className="container mx-auto py-8 bg-white rounded-md shadow-md">
      {/* Header Section */}
      <div className="flex items-center mb-8">
        {/* Profile Picture (optional) */}
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full mr-4"
          />
        )}
        {/* Name (Displayed prominently) */}
        <h1 className="text-3xl font-bold">{user.name}</h1>
      </div>
      {/* Personal Information Section */}
      <div className="mb-8 bg-gray-100 rounded-md p-4">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700">Email:</label>
            <a href={`mailto:${user.email}`} className="text-blue-500">
              {user.email}
            </a>
          </div>
          {/* Phone Number */}
          <div>
          <label className="block text-gray-700">Phone Number:</label>
          <a href={`tel:${user.contactNumber}`} className="text-blue-500">
            {user.contactNumber}
          </a>
        </div>
        {/* Employee ID */}
        <div>
          <label className="block text-gray-700">Employee ID:</label>
          <span>{user.employeeID}</span>
        </div>
      </div>
    </div>
    {/* Security & Settings Section */}
    <div className="mb-8 bg-gray-100 rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4">Security & Settings</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Password */}
        <div>
          <label className="block text-gray-700">Password:</label>
          <a href="#" className="text-blue-500">
            Change Password
          </a>
        </div>
        {/* Role */}
        <div>
          <label className="block text-gray-700">Role:</label>
          <span>{user.role}</span>
        </div>
        </div>
    </div>
    {/* Login & Activity Section */}
    <div className="mb-8 bg-gray-100 rounded-md p-4">
      <h2 className="text-xl font-semibold mb-4">Login & Activity</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Last Login Time */}
        <div>
          <label className="block text-gray-700">Last Login Time:</label>
          {/* <span>{user.lastLoginTime}</span> */}
        </div>
        {/* Login History */}
        <div className="col-span-2">
          <label className="block text-gray-700">Login History:</label>
          <ul>
            {/* {user.loginHistory.map((login, index) => (
              <li key={index}>{login}</li>
            ))} */}
          </ul>
        </div>
      </div>
    </div>
    {/* Actions Section */}
    <div className="flex justify-end mt-8">
      {/* Edit Profile Button */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">
        <FontAwesomeIcon icon={faEdit} className="mr-2" />
        Edit Profile
      </button>
 {/* Logout Button */}
 <button className="bg-red-500 text-white px-4 py-2 rounded-md">
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
    </div>
  </div>
);
  
};

export default Profile;

