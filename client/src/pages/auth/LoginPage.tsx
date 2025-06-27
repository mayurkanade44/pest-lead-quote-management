import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Globe,
  Lock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useLoginMutation, type LoginFormValues } from "../../services";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  remember: z.boolean().optional(),
});

const carouselSlides = [
  {
    id: 1,
    icon: Users,
    title: "Smart Lead Management",
    subtitle: "Capture, Track & Convert",
    description:
      "Effortlessly manage all your pest control leads in one place. Track customer inquiries, follow-ups, and conversion status with our intelligent dashboard.",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
    iconColor: "text-green-600",
    stats: { label: "Average Lead Response", value: "< 2 hours" },
  },
  {
    id: 2,
    icon: FileText,
    title: "Instant Quotations",
    subtitle: "Professional & Fast",
    description:
      "Generate professional quotations in seconds. Customize pricing, services, and terms while maintaining consistency across all your proposals.",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    iconColor: "text-blue-600",
    stats: { label: "Quotation Generation", value: "30 seconds" },
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Conversion Analytics",
    subtitle: "Data-Driven Growth",
    description:
      "Monitor your success with detailed analytics. Track conversion rates, revenue trends, and identify opportunities to grow your pest control business.",
    bgColor: "bg-gradient-to-br from-purple-50 to-violet-100",
    iconColor: "text-purple-600",
    stats: { label: "Average Conversion Rate", value: "65%" },
  },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLoginMutation({
    onSuccess: (response) => {
      login(response.data.user);
      navigate("/dashboard");
      console.log("Welcome!", response.data.user.fullName);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const currentSlideData = carouselSlides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Login Section */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col">
        {/* Header/Branding */}
        <div className="flex-shrink-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none">
          <div className="flex items-center justify-center p-4 lg:px-8 lg:pt-20">
            <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-green-600 mr-3" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Pest Lead Gen
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Professional Lead Management
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-0">
          <div className="max-w-md mx-auto w-full lg:max-w-sm">
            <div className="text-center lg:text-left mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-2xl font-semibold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to manage your leads and quotations
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 lg:space-y-4"
            >
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                <input
                  {...register("email")}
                  placeholder="Email Address*"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base lg:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password*"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base lg:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="mr-2 text-green-600 rounded focus:ring-green-500"
                  />
                  Keep me logged in
                </label>
                <a href="#" className="text-green-600 hover:text-green-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full p-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:cursor-pointer hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-base lg:text-sm font-medium mt-6"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}

        <div className="hidden lg:flex items-center justify-between text-sm px-10 py-4">
          <div>© 2025 Pest Lead Gen</div>
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2 text-blue-500" />
            ENG
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-0 relative">
        {/* Feature Showcase */}
        <div className="max-w-md lg:max-w-lg w-full">
          <div
            className={`${currentSlideData.bgColor} transition-all duration-500 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8 relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 opacity-10">
              <currentSlideData.icon className="w-full h-full" />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
              <div className="flex items-center mb-4 lg:mb-6">
                <div
                  className={`p-2 lg:p-3 ${currentSlideData.iconColor} bg-white rounded-lg shadow-md`}
                >
                  <currentSlideData.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div className="ml-3 lg:ml-4">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                    {currentSlideData.title}
                  </h3>
                  <p
                    className={`text-sm font-medium ${currentSlideData.iconColor}`}
                  >
                    {currentSlideData.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 lg:mb-6 text-sm lg:text-base leading-relaxed">
                {currentSlideData.description}
              </p>

              {/* Stats */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">
                    {currentSlideData.stats.label}
                  </span>
                  <span
                    className={`text-lg lg:text-2xl font-bold ${currentSlideData.iconColor}`}
                  >
                    {currentSlideData.stats.value}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-4 lg:mt-6">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-green-600 w-6 lg:w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 text-center max-w-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Transform Your Pest Control Business
          </h4>
          <p className="text-gray-600 text-sm lg:text-base">
            Join hundreds of pest control professionals who trust Pest Lead Gen
            to streamline their operations and boost their success rates.
          </p>
        </div>
      </div>
      <div className="lg:hidden flex items-center justify-between text-sm text-gray-500 px-5 py-4">
        <div>© 2025 Pest Lead Gen</div>
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          ENG
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
