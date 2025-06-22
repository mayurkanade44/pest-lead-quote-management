import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, Globe, Linkedin, Lock, Mail, UserCircle } from "lucide-react";
import { useLogin, type LoginFormValues } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  remember: z.boolean().optional(),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col justify-between w-1/2 p-8 bg-white">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-200 rounded-full"></div>
            <div className="text-sm">
              Don't have an account?{" "}
              <a href="#" className="font-semibold text-purple-600">
                Register
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <UserCircle className="w-16 h-16 text-gray-300" />
          <h1 className="mt-4 text-3xl font-semibold">Login to your account</h1>
          <p className="mt-2 text-gray-600">Enter your details to login.</p>

          <div className="flex mt-8 space-x-4">
            <button className="p-3 border rounded-md">
              <Apple />
            </button>
            <button className="p-3 border rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.81C34.551 6.225 29.623 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.842-5.842C34.551 6.225 29.623 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.221 0-9.58-3.684-11.171-8.584l-6.522 5.025C9.507 39.583 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.846 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
            </button>
            <button className="p-3 border rounded-md">
              <Linkedin />
            </button>
          </div>

          <div className="my-8 text-center">OR</div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            <div className="relative mb-4">
              <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                {...register("email")}
                placeholder="Email Address*"
                className="w-full p-2 pl-10 border rounded-md"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative mb-4">
              <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                {...register("password")}
                type="password"
                placeholder="Password*"
                className="w-full p-2 pl-10 border rounded-md"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="mr-2"
                />
                Keep me logged in
              </label>
              <a href="#" className="text-purple-600">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full p-3 text-white bg-purple-600 rounded-md"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>© 2024 Synergy HR</div>
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            ENG
          </div>
        </div>
      </div>
      <div className="flex-col items-center justify-center hidden w-1/2 p-8 bg-gray-100 md:flex">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Time Off</h2>
            <a href="#" className="text-sm text-purple-600">
              See All
            </a>
          </div>
          <div className="flex flex-col items-center my-4">
            <div className="relative w-40 h-20">
              <div className="absolute w-40 h-20 border-t-8 border-l-8 border-r-8 border-b-8 border-purple-500 rounded-full border-b-transparent border-l-transparent border-r-transparent transform -rotate-45"></div>
              <div className="absolute text-3xl font-bold -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                10
              </div>
              <div className="absolute text-xs text-gray-500 -translate-x-1/2 bottom-2 left-1/2">
                OUT OF 20
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between p-2 mt-2 bg-orange-100 rounded-md">
              <div>
                <p>Jan 15, 2024</p>
                <p className="text-xs text-gray-500">Casual</p>
              </div>
              <div className="px-2 py-1 text-xs text-orange-700 bg-orange-200 rounded-full">
                Pending
              </div>
            </div>
            <div className="flex items-center justify-between p-2 mt-2 bg-green-100 rounded-md">
              <div>
                <p>Jan 15, 2024</p>
                <p className="text-xs text-gray-500">Casual</p>
              </div>
              <div className="px-2 py-1 text-xs text-green-700 bg-green-200 rounded-full">
                Confirmed
              </div>
            </div>
            <div className="flex items-center justify-between p-2 mt-2 bg-red-100 rounded-md">
              <div>
                <p>Feb 12, 2024</p>
                <p className="text-xs text-gray-500">Casual</p>
              </div>
              <div className="px-2 py-1 text-xs text-red-700 bg-red-200 rounded-full">
                Rejected
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold">
            Stay in Control of Your Time Off
          </h3>
          <p className="mt-2 text-gray-600">
            Track your time off balance and manage requests with the Time Off
            widget,
            <br />
            ensuring a stress-free experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
