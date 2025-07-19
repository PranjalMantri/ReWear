import { useState, type FormEvent } from "react";
import Input from "../components/UI/Input";
import Divider from "../components/UI/Divider";
import { Link } from "react-router-dom";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const commonInputStyles =
    "px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:border-2 focus:border-emerald-400";
  const commonLabelSyles = "font-semibold";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form data: ", formData);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full sm:w-[24rem] md:w-[28rem] lg:w-96"
      >
        <div className="flex justify-center">
          <h2 className="text-2xl font-semibold">Create an Account</h2>
        </div>
        <Input
          label="Email"
          name="email"
          placeholder="Enter email"
          size="md"
          type="email"
          value={formData["email"]}
          onChange={handleChange}
          inputClassName={commonInputStyles}
          labelClassName={commonLabelSyles}
          leftIcon={<Mail />}
        />

        <Input
          label="Fullname"
          name="fullname"
          placeholder="Enter full name"
          size="md"
          type="text"
          value={formData["fullname"]}
          onChange={handleChange}
          inputClassName={commonInputStyles}
          labelClassName={commonLabelSyles}
          leftIcon={<User />}
        />

        <Input
          label="Password"
          name="password"
          placeholder="Enter password"
          size="md"
          type={visibility["password"] ? "text" : "password"}
          value={formData["password"]}
          onChange={handleChange}
          inputClassName={commonInputStyles}
          labelClassName={commonLabelSyles}
          leftIcon={<Lock />}
          rightIcon={visibility["password"] ? <Eye /> : <EyeOff />}
          onRightIconClick={() =>
            setVisibility((prev) => ({ ...prev, password: !prev.password }))
          }
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Re-enter password"
          size="md"
          type={visibility["confirmPassword"] ? "text" : "password"}
          value={formData["confirmPassword"]}
          onChange={handleChange}
          inputClassName={commonInputStyles}
          labelClassName={commonLabelSyles}
          leftIcon={<Lock />}
          rightIcon={visibility["confirmPassword"] ? <Eye /> : <EyeOff />}
          onRightIconClick={() =>
            setVisibility((prev) => ({
              ...prev,
              confirmPassword: !prev.confirmPassword,
            }))
          }
        />

        <button
          type="submit"
          className="bg-emerald-500 text-white py-3 rounded-3xl hover:bg-emerald-600 transition"
        >
          Signup
        </button>

        <Divider>or</Divider>

        <button
          type="button"
          className="bg-white text-emerald-700 py-3 border border-emerald-200 rounded-3xl hover:bg-emerald-50 transition font-semibold"
        >
          Sign up with google
        </button>

        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500 font-medium">
            Already Registered?
            <Link
              to={"/signin"}
              className="ml-1 text-sm text-emerald-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
