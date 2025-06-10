import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

const backgroundImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1507208773393-40d9fc670acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
];

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    setBackgroundImage(
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    );
  }, [user, navigate]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const profilePictureHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !input.fullname ||
      !input.email ||
      !input.phoneNumber ||
      !input.password ||
      !input.role
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      Object.keys(input).forEach((key) => formData.append(key, input[key]));
      if (profilePicture) {
        formData.append("file", profilePicture);
      }
      const res = await axios.post(`${USER_API_END_POINT}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-r from-[#00040A] to-[#001636] relative">
      <Navbar />
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Left Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt="Office background"
        />
        <div className="absolute inset-0 bg-blue-600 opacity-75"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Join HireHub</h2>
          <p className="text-xl mb-8 text-center">
            Connect with top employers and unlock your career potential
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">1000+</p>
              <p>Job Listings</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">500+</p>
              <p>Companies</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">10k+</p>
              <p>Successful Hires</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <p className="text-2xl font-bold">24/7</p>
              <p>Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0 pt-16">
        <motion.div
          className="max-w-md w-full space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-gray-300">
              Sign up and start your career journey
            </p>
          </div>
          <form
            className="bg-gray-900 shadow-xl rounded-lg p-6 space-y-4 border border-gray-800"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <div className="space-y-3">
              {/* Full Name */}
              <div className="relative">
                <Label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 transition duration-300 ease-in-out hover:border-blue-500"
                    placeholder="Full Name"
                    value={input.fullname}
                    onChange={changeEventHandler}
                  />
                  <User
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-400"
                    size={16}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Email Address <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    required
                    className="text-gray-400"
                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 transition duration-300 ease-in-out hover:border-blue-500"
                    placeholder="Email Address"
                    value={input.email}
                    onChange={changeEventHandler}
                  />
                  <Mail
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-400"
                    size={16}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="relative">
                <Label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 transition duration-300 ease-in-out hover:border-blue-500"
                    placeholder="Phone Number"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                  />
                  <Phone
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-400"
                    size={16}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10 transition duration-300 ease-in-out hover:border-blue-500"
                    placeholder="Password"
                    value={input.password}
                    onChange={changeEventHandler}
                  />
                  <Lock
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-400"
                    size={16}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-400 hover:text-blue-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-400 hover:text-blue-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="mt-3">
              <Label className="block text-sm font-medium text-white mb-2">
                Role <span className="text-red-400">*</span>
              </Label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setInput({ ...input, role: "student" })}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
                    input.role === "student"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setInput({ ...input, role: "recruiter" })}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
                    input.role === "recruiter"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="mt-3">
              <Label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-white mb-1"
              >
                Profile Picture
              </Label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer bg-gray-800 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2 text-blue-400" />
                    {profilePicture ? "Change Photo" : "Upload Photo"}
                  </label>
                  <Input
                    id="profilePicture"
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={profilePictureHandler}
                    className="hidden"
                  />
                </div>
              </div>
              {profilePicture && (
                <p className="mt-2 text-xs text-gray-400">
                  {profilePicture.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Please wait
                  </>
                ) : (
                  <>
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      size={16}
                    />
                    Sign up
                  </>
                )}
              </Button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 hover:text-blue-400 transition duration-150 ease-in-out underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
