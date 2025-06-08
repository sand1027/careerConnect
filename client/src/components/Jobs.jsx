import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  ChevronDown,
  Search,
  Star,
  Mail,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample data for trending skills and testimonials
const trendingSkills = [
  "JavaScript",
  "React",
  "Python",
  "Node.js",
  "AWS",
  "TypeScript",
];
const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    text: "Found my dream job in just a week!",
    rating: 5,
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    text: "The filters made it so easy to find relevant roles.",
    rating: 4,
  },
  {
    name: "Sam Wilson",
    role: "Data Scientist",
    text: "Amazing platform with great opportunities!",
    rating: 5,
  },
];

// Sample data for states, cities, skills, and roles (mocked)
const states = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana"];
const citiesByState = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore", "Hubli"],
  Delhi: ["New Delhi"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal"],
};
const skills = ["JavaScript", "Python", "React", "Node.js", "AWS", "SQL"];
const roles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UI/UX Designer",
  "DevOps Engineer",
];

// Simplified Job Card for Dropdown
const JobCardDropdown = ({ job, onClick }) => (
  <motion.div
    className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-md"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <img
      src={job?.company?.logo || "https://via.placeholder.com/40"}
      alt={job?.company?.name || "Company Logo"}
      className="w-10 h-10 rounded-full mr-3"
    />
    <div className="flex-1">
      <h3 className="text-white font-semibold">{job?.title || "Job Title"}</h3>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Building className="h-4 w-4" />
        <span>{job?.company?.name || "Company Name"}</span>
        <MapPin className="h-4 w-4 ml-2" />
        <span>{job?.location || "Location"}</span>
      </div>
    </div>
  </motion.div>
);

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchedQuery || "");
  const [suggestions, setSuggestions] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [salaryRange, setSalaryRange] = useState(50);
  const [experienceLevel, setExperienceLevel] = useState("Any");
  const [selectedState, setSelectedState] = useState("Any");
  const [selectedCity, setSelectedCity] = useState("Any");
  const [selectedSkill, setSelectedSkill] = useState("Any");
  const [selectedRole, setSelectedRole] = useState("Any");
  const [availableCities, setAvailableCities] = useState([]);
  const jobsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = [...allJobs];

    // Search filtering
    if (searchedQuery || searchTerm) {
      const query = (searchedQuery || searchTerm).toLowerCase();
      const queryWords = query.split(" ");
      filtered = filtered.filter((job) => {
        const searchFields = [
          job.title,
          job.description,
          job.requirements?.join(" "),
          job.location,
        ];
        return queryWords.some((word) =>
          searchFields.some((field) => field?.toLowerCase().includes(word))
        );
      });

      const suggestionWords = [
        "Software Engineer",
        "React Developer",
        "Full Stack",
        "Remote",
        "Internship",
      ];
      setSuggestions(
        suggestionWords
          .filter((word) => word.toLowerCase().includes(query))
          .slice(0, 3)
      );
    }

    // Salary filter
    if (salaryRange < 50) {
      filtered = filtered.filter((job) => (job.salary || 0) <= salaryRange);
    }

    // Experience filter
    if (experienceLevel !== "Any") {
      const [min, max] =
        experienceLevel === "5+ years"
          ? [5, Infinity]
          : experienceLevel.split("-").map(Number);
      filtered = filtered.filter((job) => {
        const exp = parseInt(job.experience) || 0;
        return exp >= min && (max ? exp <= max : true);
      });
    }

    // State and City filter
    if (selectedState !== "Any") {
      filtered = filtered.filter((job) => {
        const jobLocation = job.location?.toLowerCase() || "";
        const stateMatch = jobLocation.includes(selectedState.toLowerCase());
        if (selectedCity !== "Any") {
          return stateMatch && jobLocation.includes(selectedCity.toLowerCase());
        }
        return stateMatch;
      });
    }

    // Skill filter
    if (selectedSkill !== "Any") {
      filtered = filtered.filter((job) =>
        job.requirements?.some((req) =>
          req.toLowerCase().includes(selectedSkill.toLowerCase())
        )
      );
    }

    // Role filter
    if (selectedRole !== "Any") {
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(selectedRole.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === "date-desc") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "date-asc") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "salary-desc") {
      filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    } else if (sortOption === "salary-asc") {
      filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    }

    setFilteredJobs(filtered);
  }, [
    allJobs,
    searchedQuery,
    searchTerm,
    sortOption,
    salaryRange,
    experienceLevel,
    selectedState,
    selectedCity,
    selectedSkill,
    selectedRole,
  ]);

  // Update available cities when state changes
  useEffect(() => {
    if (selectedState === "Any") {
      setAvailableCities([]);
      setSelectedCity("Any");
    } else {
      setAvailableCities(citiesByState[selectedState] || []);
      setSelectedCity("Any");
    }
  }, [selectedState]);

  // Testimonial auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchTerm);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleJobClick = (jobId) => {
    navigate(`/description/${jobId}`);
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="bg-gradient-to-br from-[#00040A] to-[#001636] min-h-screen text-white w-full">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.section
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
              alt="Job search banner"
              className="w-full h-64 object-cover rounded-xl opacity-50"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
                Find Your Dream Job
              </h1>
              <form
                onSubmit={handleSearch}
                className="relative w-full max-w-lg"
              >
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search jobs by title, skill, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800/80 text-white border-gray-700 py-3 pl-10 pr-4 rounded-full focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search jobs"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {(suggestions.length > 0 ||
                  (searchTerm && filteredJobs.length > 0)) && (
                  <motion.div
                    className="absolute top-12 left-0 w-full bg-gray-800 rounded-md shadow-lg z-10 p-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {suggestions.length > 0 && (
                      <div className="mb-2">
                        <p className="text-gray-400 text-sm mb-1">
                          Suggestions
                        </p>
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer rounded-md"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    {searchTerm && filteredJobs.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">
                          Matching Jobs
                        </p>
                        <div className="space-y-2">
                          {filteredJobs.slice(0, 3).map((job) => (
                            <JobCardDropdown
                              key={job._id}
                              job={job}
                              onClick={() => handleJobClick(job._id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Trending Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {trendingSkills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M12 2L2 7L12 12L22 9.5V17H2V7"
                      stroke="#fff"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  {skill}
                </motion.span>
              ))}
            </div>
          </Card>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:hidden">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-blue-600 text-white py-3 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          <motion.div
            className={`lg:block ${
              showFilters ? "block" : "hidden"
            } lg:col-span-1 space-y-4`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <h3 className="text-white text-xl font-semibold mb-6">
                Advanced Filters
              </h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-300 text-sm block mb-2">
                    Salary Range (LPA)
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Up to {salaryRange} LPA
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm block mb-2">
                    Experience Level
                  </Label>
                  <Select
                    value={experienceLevel}
                    onValueChange={setExperienceLevel}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select Experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="0-2 years">0-2 years</SelectItem>
                        <SelectItem value="2-5 years">2-5 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm block mb-2">
                    State
                  </Label>
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Any">Any</SelectItem>
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
                    City
                  </Label>
                  <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                    disabled={selectedState === "Any"}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Any">Any</SelectItem>
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
                    Skill
                  </Label>
                  <Select
                    value={selectedSkill}
                    onValueChange={setSelectedSkill}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select Skill" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Any">Any</SelectItem>
                        {skills.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm block mb-2">
                    Role
                  </Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectGroup>
                        <SelectItem value="Any">Any</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    setSalaryRange(50);
                    setExperienceLevel("Any");
                    setSelectedState("Any");
                    setSelectedCity("Any");
                    setSelectedSkill("Any");
                    setSelectedRole("Any");
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </motion.div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-semibold">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""}{" "}
                Found
              </h2>
              <div className="relative">
                <select
                  className="bg-gray-900 text-white p-3 rounded-full appearance-none pr-10 shadow-md"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="salary-desc">Salary: High to Low</option>
                  <option value="salary-asc">Salary: Low to High</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job) => (
                    <motion.div
                      key={job?._id}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-gray-900 p-6 text-center text-blue-400 rounded-xl shadow-lg">
                    No jobs found. Try adjusting your filters.
                  </Card>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center items-center mt-8 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 rounded-full px-6 py-3 ${
                    currentPage === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </Button>
              </motion.div>
              <span className="text-white text-lg" aria-live="polite">
                Page {currentPage} of {totalPages}
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 rounded-full px-6 py-3 ${
                    currentPage === totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What Our Users Say
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-gray-300 italic mb-4">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[currentTestimonial].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-white font-semibold">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-400">
                  {testimonials[currentTestimonial].role}
                </p>
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
                <p className="text-gray-200">
                  Subscribe to our newsletter for the latest job opportunities
                  and career tips.
                </p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800/80 text-white border-gray-700 rounded-full py-3 px-4 flex-1"
                  aria-label="Email for newsletter"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full py-3 px-6 flex items-center">
                  Subscribe
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
