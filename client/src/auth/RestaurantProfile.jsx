// RestaurantProfile.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RestaurantProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user_id = location.state?.user_id;

    const [details, setDetails] = useState({ name: "", address: "", contact: "", image: "" });

    useEffect(() => {
        if (!user_id) navigate("/sign-up");
    }, [user_id, navigate]);

    const handleFinish = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("name", details.name);
        formData.append("address", details.address);
        formData.append("contact", details.contact);
        formData.append("image", details.image); // The actual file object

        try {
            const res = await fetch("http://localhost:5001/api/restaurant/restaurant-profile", {
                method: "POST",
                body: formData
            });
            if (res.ok) navigate("/sign-in");
        } catch (err) {
            alert("Failed to save profile");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <form onSubmit={handleFinish} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">One last step!</h2>
                {/* Profile picture */}
                <label>Select Profile Image.</label>
                <input type="file" name="image"
                    onChange={e => setDetails({ ...details, image: e.target.files[0] })} />

                {/* Restaurant name */}
                <input placeholder="Restaurant Name" className="w-full p-2 border rounded mb-3" required
                    onChange={e => setDetails({ ...details, name: e.target.value })} />

                {/* Restaurant Address */}
                <textarea placeholder="Address" className="w-full p-2 border rounded mb-3" required
                    onChange={e => setDetails({ ...details, address: e.target.value })} />

                {/* Restaurant contact */}
                <input placeholder="Contact Number" className="w-full p-2 border rounded mb-6" required
                    onChange={e => setDetails({ ...details, contact: e.target.value })} />
                <button className="w-full bg-orange-600 text-white py-2 rounded">Complete Registration</button>
            </form>
        </div>
    );
};

export default RestaurantProfile;