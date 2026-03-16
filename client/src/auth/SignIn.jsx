import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authFetch from "../utils/authFetch";

const SignIn = () => {
const [form, setForm] = useState({ email: "", password: "" });
const navigate = useNavigate();

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await authFetch("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(form),
    });

    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  } catch (err) {
    console.error(err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          sign-in
        </h2>

        <input
          name="email"
          placeholder="email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button className="bg-orange-600 text-white w-full py-2 rounded hover:bg-orange-700">
          sign-in
        </button>
      </form>
    </div>
  );
};

export default SignIn;