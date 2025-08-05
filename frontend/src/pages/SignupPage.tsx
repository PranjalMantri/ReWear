import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

import Input from "../components/UI/Input";
import Divider from "../components/UI/Divider";

import { signupSchema } from "../../../common/schema/user.schema";
import useUserStore from "../store/user.store";

type FormFields = z.infer<typeof signupSchema>;

function SignupPage() {
  const { isLoading, error, signupUser } = useUserStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const commonInputStyles =
    "px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:border-2 focus:border-emerald-400";
  const commonLabelSyles = "font-semibold";

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await signupUser(data);
      navigate("/");
    } catch (error) {}
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full sm:w-[24rem] md:w-[28rem] lg:w-96"
      >
        <div className="flex justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create an Account
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter Email"
                label="Email"
                type="email"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelSyles}
                leftIcon={<Mail />}
              />
            )}
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Fullname"
                placeholder="Enter full name"
                type="text"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelSyles}
                leftIcon={<User />}
              />
            )}
          />
          {errors.fullname && (
            <div className="text-red-500 text-sm">
              {errors.fullname.message}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Password"
                placeholder="Enter password"
                type={visibility.password ? "text" : "password"}
                inputClassName={commonInputStyles}
                labelClassName={commonLabelSyles}
                leftIcon={<Lock />}
                rightIcon={visibility.password ? <Eye /> : <EyeOff />}
                onRightIconClick={() =>
                  setVisibility((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
              />
            )}
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Confirm Password"
                placeholder="Re-enter password"
                type={visibility.confirmPassword ? "text" : "password"}
                inputClassName={commonInputStyles}
                labelClassName={commonLabelSyles}
                leftIcon={<Lock />}
                rightIcon={visibility.confirmPassword ? <Eye /> : <EyeOff />}
                onRightIconClick={() =>
                  setVisibility((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
              />
            )}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 mt-2 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition font-semibold"
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        <Divider>or</Divider>

        <button
          type="button"
          className="bg-white text-emerald-700 py-3 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition font-semibold"
        >
          Sign up with Google
        </button>

        <div className="flex items-center justify-center mt-2">
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
