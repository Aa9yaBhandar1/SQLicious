import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./auth/SignIn";
import MultiStepSignUp from "./auth/MultiStepSignUp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RestaurantProfile from "./auth/RestaurantProfile";
import ProfileSetting from "./pages/ProfileSetting";
import {Toaster} from "react-hot-toast";
import Restaurant from "./pages/Restaurant";
import RestaurantMenu from "./components/MenuPage/RestaurantMenu"
import CartPage from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<MultiStepSignUp />} />
        <Route path="/restaurant-profile" element={<RestaurantProfile />} />
        <Route path="/profile" element={<ProfileSetting/>} />
        <Route path="/restaurant" element={<Restaurant/>} />
        <Route path="/restaurant/:id/menu" element={<RestaurantMenu/>}/>
        <Route path="/cart" element={<CartPage/>}/>

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