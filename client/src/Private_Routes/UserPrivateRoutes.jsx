import { Outlet, Navigate  } from "react-router-dom";

const UserPrivateRoutes = () => {
  // Replace this check with your actual authentication logic
  const isAuthenticated = localStorage.getItem("email") !== null;

  if (!isAuthenticated) {
    window.alert("Please Login First.");
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/userLogin" replace />
};

export default UserPrivateRoutes;