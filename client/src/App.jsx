import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RestaurantProfile from "./pages/RestaurantProfile";
import ProfileSetting from "./pages/ProfileSetting";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/restaurant-profile" element={<RestaurantProfile />} />
        <Route path="/profile" element={<ProfileSetting/>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;