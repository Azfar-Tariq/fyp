import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./admin/Admin";
import User from "./user/User";
import AdminLogin from "./admin/pages/AdminLogin";
import UserLogin from "./user/pages/UserLogin"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user/*" element={<User />} />
        <Route path="/userLogin/" element={<UserLogin />}/>
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
