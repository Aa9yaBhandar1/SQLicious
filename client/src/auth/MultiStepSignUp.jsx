import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { User, Store, ArrowRight, ArrowLeft, CheckCircle, Camera } from "lucide-react";

// Enterprise Validation Schema
const schema = z.object({
  // Step 1: Account
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ characters"),
  role: z.enum(["customer", "restaurant"]),
  // Step 2: Profile (Conditional)
  resName: z.string().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  image: z.any().optional(),
}).refine((data) => {
  if (data.role === "restaurant") {
    return !!data.resName && !!data.address && !!data.contact;
  }
  return true;
}, { message: "Restaurant details are required", path: ["resName"] });

const EnhancedSignUp = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "customer" }
  });

  const role = watch("role");

  // Single standard endpoint for atomic creation
  const onSubmit = async (values) => {
    const formData = new FormData();
    // Append everything to one request
    Object.keys(values).forEach(key => {
      if (key === 'image' && values.image?.[0]) {
        formData.append('image', values.image[0]);
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const res = await fetch("http://localhost:5001/api/auth/register-full", {
        method: "POST",
        body: formData,
      });
      if (res.ok) navigate("/sign-in");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  const handleNext = async () => {
    // Validate only current step fields before proceeding
    const fieldsToValidate = step === 1 ? ["name", "email", "password"] : [];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (role === "customer") handleSubmit(onSubmit)();
      else setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100">
          <div 
            className="h-full bg-orange-500 transition-all duration-500" 
            style={{ width: role === 'customer' ? '100%' : `${(step / 2) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {step === 1 ? "Get Started" : "Business Details"}
            </h1>
            <p className="text-slate-500 mt-2">
              {step === 1 ? "Create your account to continue" : "Tell us about your restaurant"}
            </p>
          </header>

          {step === 1 ? (
            <div className="space-y-5">
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                <RoleButton active={role === 'customer'} onClick={() => setValue('role', 'customer')} icon={<User size={18}/>} label="Customer" />
                <RoleButton active={role === 'restaurant'} onClick={() => setValue('role', 'restaurant')} icon={<Store size={18}/>} label="Restaurant" />
              </div>

              <InputField label="Full Name" error={errors.name} {...register("name")} />
              <InputField label="Email Address" type="email" error={errors.email} {...register("email")} />
              <InputField label="Password" type="password" error={errors.password} {...register("password")} />
              
              <button type="button" onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                {role === 'customer' ? 'Create Account' : 'Next Step'} <ArrowRight size={20}/>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col items-center mb-4">
                 <label className="cursor-pointer group relative">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300 group-hover:border-orange-500 overflow-hidden">
                       <Camera className="text-slate-400 group-hover:text-orange-500" />
                    </div>
                    <input type="file" className="hidden" {...register("image")} />
                 </label>
                 <span className="text-xs text-slate-400 mt-2">Upload Restaurant Logo</span>
              </div>

              <InputField label="Restaurant Name" error={errors.resName} {...register("resName")} />
              <InputField label="Phone Number" error={errors.contact} {...register("contact")} />
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Address</label>
                <textarea {...register("address")} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" rows="3" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  <ArrowLeft size={20}/> Back
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition flex items-center justify-center gap-2">
                  {isSubmitting ? "Processing..." : "Finish"} <CheckCircle size={20}/>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const RoleButton = ({ active, onClick, icon, label }) => (
  <button type="button" onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition ${active ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500'}`}>
    {icon} {label}
  </button>
);

const InputField = React.forwardRef(({ label, error, ...props }, ref) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
    <input ref={ref} {...props} className={`w-full p-3 border rounded-xl focus:ring-2 outline-none transition ${error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-orange-200 border-slate-200'}`} />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
));

export default EnhancedSignUp;