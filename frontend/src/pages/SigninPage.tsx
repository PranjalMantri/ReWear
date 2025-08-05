import { Link, useNavigate } from "react-router-dom";
import Divider from "../components/UI/Divider";
import Input from "../components/UI/Input";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../../common/schema/user.schema";
import useUserStore from "../store/user.store";

type SigninFormFields = z.infer<typeof signinSchema>;

function SignupPage() {
  const { isLoading, error, signinUser } = useUserStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const commonInputStyles =
    "px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:border-2 focus:border-emerald-400";
  const commonLabelSyles = "font-semibold";

  const onSubmit: SubmitHandler<SigninFormFields> = async (data) => {
    await signinUser(data);
    navigate("/", { replace: true });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full sm:w-[24rem] md:w-[28rem] lg:w-96"
      >
        <div className="flex justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back!
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                placeholder="Enter email"
                type="email"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelSyles}
                leftIcon={<Mail />}
              />
            )}
          />
          {errors?.email?.message && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
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
                type={isPasswordVisible ? "text" : "password"}
                inputClassName={commonInputStyles}
                labelClassName={commonLabelSyles}
                leftIcon={<Mail />}
                rightIcon={isPasswordVisible ? <Eye /> : <EyeOff />}
                onRightIconClick={() =>
                  setIsPasswordVisible(!isPasswordVisible)
                }
              />
            )}
          />
          {errors?.password?.message && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
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
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <Divider>or</Divider>

        <button
          type="button"
          className="bg-white text-emerald-700 py-3 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition font-semibold"
        >
          Sign in with Google
        </button>

        <div className="flex items-center justify-center mt-2">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?
            <Link
              to={"/signup"}
              replace
              className="ml-1 text-sm text-emerald-500 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
