import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const GeneralSettings = ({ user: sessionUser }) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
  });

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const isRestaurant = sessionUser?.role === "restaurant";

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUserData(data.user);
          setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          address: data.user.address || "",
          contact: data.user.contact || "",
        });
        } else {
          toast.error("Failed to load profile");
        }
      } catch {
        toast.error("Server connection lost");
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      const response = await fetch(
        "http://localhost:5000/api/user/profile-update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("All changes saved!", { id: loadingToast });

        const updatedUser = {
          ...sessionUser,
          ...formData,
        };

        setUserData(updatedUser);
      } else {
        toast.error("Update failed", { id: loadingToast });
      }
    } catch {
      toast.error("Server connection lost", { id: loadingToast });
    }

    setLoading(false);
    console.log(userData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          General Settings
        </h2>

        <p className="text-gray-500 text-sm">
          Update your {sessionUser?.role} account information.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Display Name
          </label>

          <input
            name="name"
            placeholder={userData?.name || "Your name"}
            value={formData.name}
            onChange={handleChange}
            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#FF7F11] outline-none transition"
          />
        </div>

        {/* Email (Customer Only) */}
        {!isRestaurant && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Email Address
            </label>

            <input
              name="email"
              placeholder={userData?.email || "example@email.com"}
              value={formData.email}
              onChange={handleChange}
              className="p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#CBE896] outline-none transition"
            />
          </div>
        )}

        {/* Restaurant fields */}
        {isRestaurant && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Business Address
              </label>

              <input
                name="address"
                placeholder={userData?.address || "123 SQL Street"}
                value={formData.address}
                onChange={handleChange}
                className="p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#FF7F11] outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Contact Number
              </label>

              <input
                name="contact"
                placeholder={userData?.contact || "+977 98XXXXXXXX"}
                value={formData.contact}
                onChange={handleChange}
                className="p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#FF7F11] outline-none transition"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF7F11] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:-translate-y-1 transition active:scale-95 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save All Changes"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default GeneralSettings;