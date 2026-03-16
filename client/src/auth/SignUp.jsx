// SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authFetch from "../utils/authFetch";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await authFetch("/auth/sign-up", {
            method: "POST",
            body: JSON.stringify(form),
        });

        console.log("Backend Response:", data);

        if (data && data.user) {
            if (data.user.role === 'restaurant') {
                navigate("/dashboard", { 
                    state: { user_id: data.user.user_id } 
                });
            } else {
                navigate("/sign-in");
            }
        }
    } catch (error) {
        console.error("Signup error:", error);
    }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}

        <input name="name" placeholder="Full Name" required onChange={(e) => setForm({...form, name: e.target.value})} className="w-full mb-3 p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" required onChange={(e) => setForm({...form, email: e.target.value})} className="w-full mb-3 p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" required onChange={(e) => setForm({...form, password: e.target.value})} className="w-full mb-4 p-2 border rounded" />

        <div className="flex gap-2 mb-6">
          <button type="button" onClick={() => setForm({...form, role: 'customer'})} 
            className={`flex-1 p-2 rounded border ${form.role === 'customer' ? 'bg-orange-500 text-white' : 'bg-white'}`}>Customer</button>
          <button type="button" onClick={() => setForm({...form, role: 'restaurant'})} 
            className={`flex-1 p-2 rounded border ${form.role === 'restaurant' ? 'bg-orange-500 text-white' : 'bg-white'}`}>Restaurant</button>
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;