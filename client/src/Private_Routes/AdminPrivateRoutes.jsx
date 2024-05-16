import { Outlet, Navigate  } from "react-router-dom";

const AdminPrivateRoutes = () => {
  // Replace this check with your actual authentication logic
  const isAuthenticated = localStorage.getItem("email") !== null;

  if (!isAuthenticated) {
    window.alert("Please Login First.");
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
};

export default AdminPrivateRoutes;