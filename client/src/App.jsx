import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./admin/Admin";
import User from "./user/User";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user/*" element={<User />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
