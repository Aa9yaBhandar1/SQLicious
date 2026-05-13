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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-orange-200 opacity-80 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-orange-300 opacity-70 blur-3xl"></div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/95 border border-orange-100 shadow-2xl rounded-[32px] p-10 backdrop-blur-md"
        >
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 font-semibold">
              Welcome back
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              Sign in to SQLicious
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Secure access to your menu, orders, and dashboard in one place.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </label>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Need help?</span>
              <span className="font-semibold text-orange-600">Forgot password?</span>
            </div>

            <button className="w-full rounded-2xl bg-orange-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-orange-200/50 transition hover:bg-orange-700">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;