import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../shared/Footer";

// Sample data for states and cities (mocked)
const states = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana"];
const citiesByState = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore", "Hubli"],
  Delhi: ["New Delhi"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal"],
};

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "", // Will be set as "City, State"
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  useEffect(() => {
    if (selectedState) {
      setAvailableCities(citiesByState[selectedState] || []);
      setSelectedCity("");
    } else {
      setAvailableCities([]);
      setSelectedCity("");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity && selectedState) {
      setInput((prev) => ({
        ...prev,
        location: `${selectedCity}, ${selectedState}`,
      }));
    } else {
      setInput((prev) => ({ ...prev, location: "" }));
    }
  }, [selectedCity, selectedState]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity) {
      toast.error("Please select both state and city.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#00040A] to-[#001636] min-h-screen text-white w-full">
      <Navbar />
      <motion.div
        className="flex items-center justify-center w-full my-5 pt-20 pb-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 shadow-xl rounded-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Post a New Job
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                Title <span className="text-blue-400">*</span>
              </Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="w-full bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                Description <span className="text-blue-400">*</span>
              </Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="w-full bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                Requirements <span className="text-blue-400">*</span>
              </Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="w-full bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                Salary (LPA) <span className="text-blue-400">*</span>
              </Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="w-full bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                State <span className="text-blue-400">*</span>
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectGroup>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                City <span className="text-blue-400">*</span>
              </Label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={!selectedState}
              >
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectGroup>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                Job Type <span className="text-blue-400">*</span>
              </Label>
              <Select
                value={input.jobType}
                onValueChange={(value) =>
                  setInput({ ...input, jobType: value })
                }
              >
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectGroup>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                Experience Level <span className="text-blue-400">*</span>
              </Label>
              <Select
                value={input.experience}
                onValueChange={(value) =>
                  setInput({ ...input, experience: value })
                }
              >
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                  <SelectValue placeholder="Select Experience" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectGroup>
                    <SelectItem value="0-2 years">0-2 years</SelectItem>
                    <SelectItem value="2-5 years">2-5 years</SelectItem>
                    <SelectItem value="5+ years">5+ years</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 text-sm block mb-2">
                No of Positions <span className="text-blue-400">*</span>
              </Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="w-full bg-gray-800 text-white border-gray-700 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Label className="text-gray-300 text-sm block mb-2">
                  Company <span className="text-blue-400">*</span>
                </Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </motion.div>
          {loading ? (
            <Button className="w-full mt-8 bg-blue-600 text-white rounded-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-300"
            >
              Post New Job
            </Button>
          )}
          {companies.length === 0 && (
            <p className="text-sm text-blue-400 font-semibold text-center mt-4">
              *Please register a company first before posting jobs.
            </p>
          )}
        </form>
      </motion.div>
      <Footer />
    </div>
  );
};

export default PostJob;
