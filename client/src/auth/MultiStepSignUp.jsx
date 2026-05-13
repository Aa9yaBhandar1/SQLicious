import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { 
  User, Store, ArrowRight, ArrowLeft, 
  CheckCircle, Camera, ShieldCheck, Star 
} from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ characters"),
  role: z.enum(["customer", "restaurant"]),
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

  const onSubmit = async (values) => {
    const formData = new FormData();
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
    const fieldsToValidate = step === 1 ? ["name", "email", "password"] : [];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (role === "customer") handleSubmit(onSubmit)();
      else setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-4 lg:p-8 font-sans text-slate-900">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(255,115,0,0.1)] overflow-hidden border border-orange-100">
        
        {/* Left Side: Branding & Social Proof */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-orange-600 to-orange-500 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-orange-600 rounded-sm rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight">SavorFlow</span>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Scale your restaurant <br /> business with ease.
            </h2>
            <p className="text-orange-100 text-lg mb-8">
              Join over 2,000+ businesses optimizing their operations and customer reach.
            </p>

            <div className="space-y-4">
              <FeatureItem text="Advanced analytics dashboard" />
              <FeatureItem text="Direct-to-customer marketing" />
              <FeatureItem text="Enterprise-grade security" />
            </div>
          </div>

          <div className="relative z-10 p-6 bg-orange-400/20 rounded-2xl border border-orange-300/30 backdrop-blur-sm">
            <div className="flex gap-1 mb-2">
               {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="white" />)}
            </div>
            <p className="text-sm italic text-orange-50" >
              "This platform transformed how we handle our weekend rushes. A total game changer for the culinary industry!"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full" />
              <div>
                <p className="text-sm font-bold">Chef Marco Pierre</p>
                <p className="text-xs text-orange-200">The Golden Grill</p>
              </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-400 rounded-full opacity-20" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-700 rounded-full opacity-20" />
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-2">
              <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-orange-500' : 'bg-slate-100'}`} />
              {role === 'restaurant' && (
                <div className={`h-1.5 w-12 rounded-full transition-all ${step === 2 ? 'bg-orange-500' : 'bg-slate-100'}`} />
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step 0{step} of {role === 'restaurant' ? '02' : '01'}</span>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {step === 1 ? "Create Account" : "Business Details"}
            </h1>
            <p className="text-slate-500 mt-2">
              {step === 1 ? "Enter your credentials to get started." : "Finalize your restaurant profile."}
            </p>
          </header>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <div key="step1" className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <RoleCard active={role === 'customer'} onClick={() => setValue('role', 'customer')} icon={<User size={20}/>} label="Customer" />
                  <RoleCard active={role === 'restaurant'} onClick={() => setValue('role', 'restaurant')} icon={<Store size={20}/>} label="Business" />
                </div>

                <div className="space-y-4">
                  <InputField label="Full Name" placeholder="John Doe" error={errors.name} {...register("name")} />
                  <InputField label="Email Address" type="email" placeholder="john@company.com" error={errors.email} {...register("email")} />
                  <InputField label="Password" type="password" placeholder="••••••••" error={errors.password} {...register("password")} />
                </div>
                
                <button type="button" onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 group">
                  {role === 'customer' ? 'Create My Account' : 'Continue to Details'} 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div key="step2" className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-center mb-6">
                   <label className="cursor-pointer group relative">
                      <div className="w-28 h-28 bg-orange-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-orange-200 group-hover:border-orange-500 transition-colors overflow-hidden">
                         <Camera className="text-orange-400 mb-1" />
                         <span className="text-[10px] font-bold text-orange-400">LOGO</span>
                      </div>
                      <input type="file" className="hidden" {...register("image")} />
                   </label>
                </div>

                <div className="space-y-4">
                  <InputField label="Legal Restaurant Name" placeholder="The Pizza Hub" error={errors.resName} {...register("resName")} />
                  {/* FIX: Ensure register("contact") is distinct and name attribute is passed */}
                  <InputField label="Business Contact" placeholder="+1 (555) 000-0000" error={errors.contact} {...register("contact")} />
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block ml-1">Physical Address</label>
                    <textarea {...register("address")} placeholder="123 Culinary Ave, Suite 4..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none" rows="3" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition flex items-center justify-center gap-2">
                    <ArrowLeft size={18}/> Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-2xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition flex items-center justify-center gap-2">
                    {isSubmitting ? "Onboarding..." : "Finish Setup"} <CheckCircle size={18}/>
                  </button>
                </div>
              </div>
            )}
          </form>

          <footer className="mt-10 text-center">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <ShieldCheck size={14}/> Secure, encrypted connection
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ active, onClick, icon, label }) => (
  <button type="button" onClick={onClick} className={`flex items-center justify-center gap-3 py-3 rounded-xl transition-all ${active ? 'bg-white shadow-md text-orange-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} <span className="font-bold text-sm">{label}</span>
  </button>
);

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-orange-400/30 flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full" />
    </div>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const InputField = React.forwardRef(({ label, error, name, ...props }, ref) => (
  <div className="w-full">
    <label htmlFor={name} className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block ml-1">
      {label}
    </label>
    <input 
      id={name}
      name={name} 
      ref={ref} 
      {...props} 
      className={`w-full p-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none transition-all ${
        error ? 'border-red-500 focus:ring-red-100' : 'focus:ring-orange-500/10 border-slate-200 focus:border-orange-500'
      }`} 
    />
    {error && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 uppercase">{error.message}</p>}
  </div>
));

export default EnhancedSignUp;