import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./admin/Admin";
import User from "./user/User";
import AdminLogin from "./admin/pages/AdminLogin";
import UserLogin from "./user/pages/UserLogin";
import AdminPrivateRoute from "./Private_Routes/AdminPrivateRoutes";
import UserPrivateRoute from "./Private_Routes/UserPrivateRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
        <Route element={<UserPrivateRoute />}>
          <Route path="/user/*" element={<User />} />
        </Route>
        <Route path="/userLogin/" element={<UserLogin />} />
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
