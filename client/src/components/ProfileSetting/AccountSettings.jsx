import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/tokenUtils";


const AccountSettings = () => {
    const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getUserFromToken();
  const user_id = user.user_id;

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting your account...");

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/delete/${user_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Account deleted successfully", { id: loadingToast });
        localStorage.clear();
        navigate("/sign-in");

      } else {
        const data = await response.json();
        toast.error(data.message || "Deletion failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Server connection lost", { id: loadingToast });
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </div>
  );
};

export default AccountSettings;