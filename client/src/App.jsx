import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RestaurantProfile from "./auth/RestaurantProfile";
import ProfileSetting from "./pages/ProfileSetting";
import {Toaster} from "react-hot-toast";
import Restaurant from "./pages/Restaurant";

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
        <Route path="/restaurant" element={<Restaurant/>} />

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