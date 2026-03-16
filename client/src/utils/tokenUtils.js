import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
 const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return null;
        }

        return {
            user_id: decoded.user_id,
            role: decoded.role,
            name: decoded.name,
            restaurant_id: decoded.restaurant_id, 
        };
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};