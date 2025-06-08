import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
  useMemo,
  useTransition,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Text3D,
  MeshDistortMaterial,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Star,
  Users,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
  Building,
  MessageSquare,
  Bell,
  Shield,
  ChevronLeft,
} from "lucide-react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import CountUp from "react-countup";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBoat from "./ChatBoat";
import BlogSection from "./BlogSection";
import CTABanner from "./CTABanner";

const companyLogos = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Facebook",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg",
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    name: "Intel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
  },
  {
    name: "Cisco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
  },
];

const CompanyLogo = ({ company, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="w-40 h-24 bg-[#001636] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center">
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="max-w-full max-h-full object-contain p-4 filter grayscale hover:grayscale-0 transition-all duration-300"
        />
      </div>
      <p className="mt-4 text-gray-300 font-semibold">{company.name}</p>
    </motion.div>
  );
};

function JobBag() {
  const bagRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    bagRef.current.rotation.y = Math.sin(t / 2) * 0.1;
  });

  return (
    <group ref={bagRef}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 2, 32]} />
        <MeshDistortMaterial
          color="#4A90E2"
          speed={2}
          distort={0.3}
          radius={1}
        />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[0.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#F5A623" />
      </mesh>
    </group>
  );
}

function FloatingIcons() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontPath = "/fonts/helvetiker_regular.typeface.json";
  const fallbackFont =
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json";

  useEffect(() => {
    fetch(fontPath)
      .then((response) => {
        if (!response.ok) throw new Error("Font not found");
        return response.json();
      })
      .then(() => setFontLoaded(true))
      .catch((error) => {
        console.error("Failed to load font:", error);
        setFontLoaded(false);
      });
  }, []);

  const iconsData = useMemo(
    () => [
      { position: [-1.2, 0.5, 0], color: "#50E3C2", text: "Resume" },
      { position: [1.2, 0.5, 0], color: "#FF6B6B", text: "Jobs" },
      { position: [0, 1.5, 0], color: "#4A90E2", text: "Search" },
      { position: [-0.8, -0.8, 0], color: "#FFD166", text: "Skills" },
      { position: [0.8, -0.8, 0], color: "#9B59B6", text: "Network" },
    ],
    []
  );

  return (
    <>
      {iconsData.map((icon, index) => (
        <Float key={index} speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <mesh position={icon.position} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial
              color={icon.color}
              speed={4}
              distort={0.5}
              radius={1}
            />
          </mesh>
          <Text3D
            font={fontLoaded ? fontPath : fallbackFont}
            position={[
              icon.position[0],
              icon.position[1] - 0.3,
              icon.position[2],
            ]}
            size={0.15}
            height={0.02}
            curveSegments={12}
          >
            {icon.text}
            <meshStandardMaterial color="white" />
          </Text3D>
        </Float>
      ))}
    </>
  );
}

function Particles({ count = 500 }) {
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return positions;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#FFFFFF"
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  );
}

function JobPortalScene() {
  return (
    <group position={[0, -0.5, 0]}>
      <JobBag />
      <FloatingIcons />
      <Particles />
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        position={[0, 0.5, 0]}
      >
        <group>
          <mesh position={[-1.5, 1, 0]} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial color="#4A90E2" speed={2} distort={0.2} />
          </mesh>
          <mesh position={[1.5, 1, 0]} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial color="#F5A623" speed={2} distort={0.2} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

const Fallback2DScene = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#001636] rounded-lg">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-2">Job Portal</h3>
      <p className="text-gray-300">Connecting talent with opportunities</p>
    </div>
  </div>
);

const JobCard = ({ job }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-[#001636] rounded-xl shadow-md p-5 max-w-sm mx-auto border border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
            {job.company[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
              {job.title}
            </h3>
            <p className="text-sm text-blue-400">{job.company}</p>
          </div>
        </div>
        {job.featured && (
          <span className="bg-yellow-400/10 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            <Star size={10} className="mr-1" />
            Featured
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-300">
        <div className="flex items-center">
          <MapPin size={14} className="mr-1 text-blue-400" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center">
          <DollarSign size={14} className="mr-1 text-green-500" />
          <span className="truncate">{job.salary}</span>
        </div>
        <div className="flex items-center">
          <Briefcase size={14} className="mr-1 text-purple-500" />
          <span className="truncate">{job.type}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-red-500" />
          <span className="truncate">{job.posted}</span>
        </div>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2 mb-3">
        {job.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="bg-blue-400/10 text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
      <button className="w-full bg-blue-400 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition duration-300 flex items-center justify-center">
        <FileText size={16} className="mr-2" />
        Apply Now
      </button>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-[#001636] rounded-lg shadow-xl p-6 text-center"
  >
    <Icon size={40} className="text-blue-400 mb-4 mx-auto" />
    <CountUp
      end={value}
      duration={2.5}
      separator=","
      className="text-3xl font-bold text-white"
    />
    <p className="text-gray-300 mt-2">{label}</p>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-[#001636] rounded-lg shadow-xl p-6"
  >
    <Icon size={40} className="text-blue-400 mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const FloatingActionButton = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <button
        className="bg-blue-400 text-white rounded-full p-4 shadow-lg hover:bg-blue-500 transition-colors duration-300"
        onClick={() => navigate("/find-jobs")}
      >
        <Search size={24} />
      </button>
    </motion.div>
  );
};

const RotatingSquare = ({ jobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length);
  };

  const rotateRight = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length);
  };

  return (
    <div className="rotating-square-container relative w-full max-w-md h-[400px] perspective-1000">
      <button
        onClick={rotateLeft}
        className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-[#001636] text-blue-400 p-2.5 rounded-full shadow-md hover:bg-blue-400 hover:text-white transition duration-300 z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <div
        className="rotating-square relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `rotateY(${currentIndex * 90}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="square-face absolute w-full h-full flex items-center justify-center"
            style={{
              transform: `rotateY(${index * 90}deg) translateZ(200px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>
      <button
        onClick={rotateRight}
        className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-[#001636] text-blue-400 p-2.5 rounded-full shadow-md hover:bg-blue-400 hover:text-white transition duration-300 z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const { allJobs } = useSelector((store) => store.job || { allJobs: [] });
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    setWebGLAvailable(
      !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      )
    );
  }, []);

  useEffect(() => {
    if (user?.role) {
      startTransition(() => {
        switch (user.role) {
          case "recruiter":
            navigate("/recruiter/companies");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            break;
        }
      });
    }
  }, [user?.role, navigate]);

  const stats = [
    { icon: Users, value: 100000, label: "Job Seekers" },
    { icon: Briefcase, value: 50000, label: "Jobs Posted" },
    { icon: Building, value: 10000, label: "Companies" },
    { icon: CheckCircle, value: 75000, label: "Successful Hires" },
  ];

  const features = [
    {
      icon: Search,
      title: "Advanced Job Search",
      description: "Find the perfect job with our powerful search tools.",
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Create a professional resume with our easy-to-use builder.",
    },
    {
      icon: Bell,
      title: "Job Alerts",
      description:
        "Get notified about new job opportunities that match your preferences.",
    },
    {
      icon: MessageSquare,
      title: "Interview Coaching",
      description:
        "Prepare for interviews with our AI-powered coaching sessions.",
    },
    {
      icon: Shield,
      title: "Verified Employers",
      description: "Apply with confidence to jobs from verified employers.",
    },
  ];

  // Debugging logs
  console.log("allJobs:", allJobs);
  console.log(
    "Filtered featured jobs:",
    allJobs.filter((job) => job.featured)
  );

  const featuredJobs =
    allJobs.length > 0
      ? allJobs
          .filter((job) => job.featured === true)
          .slice(0, 3)
          .map((job) => ({
            id: job._id || `job-${Math.random()}`,
            title: job.title || "Untitled Job",
            company: job.company?.name || "Unknown Company",
            location: job.location || "Remote",
            salary: job.salary || "Competitive",
            type: job.jobType || "Full-time",
            posted: job.createdAt
              ? new Date(job.createdAt).toLocaleDateString()
              : "Recent",
            description: job.description || "No description available.",
            skills: job.skills || [],
            featured: job.featured || false,
          }))
          .concat(
            allJobs.length > 0 &&
              allJobs.filter((job) => job.featured === true).length === 0
              ? allJobs.slice(0, 3).map((job) => ({
                  id: job._id || `job-${Math.random()}`,
                  title: job.title || "Untitled Job",
                  company: job.company?.name || "Unknown Company",
                  location: job.location || "Remote",
                  salary: job.salary || "Competitive",
                  type: job.jobType || "Full-time",
                  posted: job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recent",
                  description: job.description || "No description available.",
                  skills: job.skills || [],
                  featured: job.featured || false,
                }))
              : []
          )
      : [
          {
            id: "1",
            title: "Software Engineer",
            company: "TechCorp",
            location: "Remote",
            salary: "$100k-$150k",
            type: "Full-time",
            posted: "Recent",
            description: "Join our team to build innovative solutions.",
            skills: ["JavaScript", "React", "Node.js"],
            featured: true,
          },
          {
            id: "2",
            title: "Data Scientist",
            company: "AI Innovations",
            location: "San Francisco, CA",
            salary: "$120k-$150k",
            type: "Full-time",
            posted: "Recent",
            description: "Analyze data to drive business decisions.",
            skills: ["Python", "TensorFlow", "SQL"],
            featured: true,
          },
        ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#00040A] to-[#001636]">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-b from-[#00040A] to-[#001636] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-gray-700/10 animate-pulse"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]"></div>
            </div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gray-700/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-20 lg:mt-0">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="inline-block">
                    <span className="px-4 py-2 rounded-full bg-blue-400/10 backdrop-blur-sm border border-gray-700 text-gray-300 text-sm font-medium">
                      #1 Job Portal Platform
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    <span className="text-white">Find Your</span>
                    <span className="block mt-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      Dream Job
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Connect with top employers and unlock opportunities that
                    match your skills and goals.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8">
                    {[
                      { number: "10K+", label: "Active Jobs" },
                      { number: "50K+", label: "Companies" },
                      { number: "100K+", label: "Job Seekers" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="bg-blue-400/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700"
                      >
                        <div className="text-3xl font-bold text-white mb-1">
                          {stat.number}
                        </div>
                        <div className="text-gray-300">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="h-[400px] lg:h-[600px] w-full relative"
                >
                  {webGLAvailable ? (
                    <Canvas
                      shadows
                      camera={{ position: [0, 2, 5], fov: 50 }}
                      className="rounded-xl"
                      style={{ background: "transparent" }}
                    >
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <spotLight
                          position={[10, 10, 10]}
                          angle={0.15}
                          penumbra={1}
                          shadow-mapSize={[512, 512]}
                          castShadow
                          intensity={1.5}
                        />
                        <JobPortalScene />
                        <OrbitControls
                          enableZoom={false}
                          autoRotate
                          autoRotateSpeed={0.5}
                          maxPolarAngle={Math.PI / 2}
                          minPolarAngle={Math.PI / 3}
                        />
                        <Environment preset="city" />
                      </Suspense>
                    </Canvas>
                  ) : (
                    <Fallback2DScene />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full"
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 70C840 80 960 100 1080 110C1200 120 1320 120 1380 120H1440V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z"
                fill="#001636"
                className="opacity-95"
              />
            </svg>
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-20 bg-[#001636]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Trusted by Top Employers
              </h2>
              <p className="text-lg text-gray-300 max-w-xl mx-auto">
                Join thousands of employers finding top talent on our platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 justify-items-center"
            >
              {companyLogos.map((company, index) => (
                <CompanyLogo
                  key={company.name}
                  company={company}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-[#00040A] to-[#001636]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Sign Up",
                  description:
                    "Create an account and complete your profile to showcase your skills.",
                },
                {
                  icon: Search,
                  title: "Search Jobs",
                  description:
                    "Browse thousands of jobs or use our powerful search tools to find your dream job.",
                },
                {
                  icon: FileText,
                  title: "Apply Easily",
                  description:
                    "Apply to jobs with a single click and track your application status.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-blue-400/10 p-4 rounded-full mb-4">
                    <step.icon size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-20 bg-[#001636]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Popular Job Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                "Technology",
                "Healthcare",
                "Finance",
                "Education",
                "Marketing",
                "Design",
                "Sales",
                "Engineering",
              ].map((category, index) => (
                <motion.a
                  key={index}
                  href={`/jobs/${category.toLowerCase()}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#00040A] rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {category}
                  </h3>
                  <p className="text-blue-400">View Jobs</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16 bg-gradient-to-b from-[#00040A] to-[#001636]">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Featured Jobs
            </motion.h2>
            <div className="flex justify-center items-center h-[400px] relative">
              {featuredJobs.length > 0 ? (
                <RotatingSquare jobs={featuredJobs} />
              ) : (
                <motion.p
                  className="text-lg text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No featured jobs available.
                </motion.p>
              )}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="relative py-20 bg-[#001636] text-white">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "John Doe",
                  role: "Software Engineer",
                  company: "TechCorp",
                  quote:
                    "I landed my dream job through this platform. The process was seamless!",
                },
                {
                  name: "Jane Smith",
                  role: "Marketing Manager",
                  company: "GrowEasy",
                  quote:
                    "The job listings and easy application process made my search effortless.",
                },
                {
                  name: "Alex Johnson",
                  role: "Data Scientist",
                  company: "AI Solutions",
                  quote:
                    "This platform helped me connect with top employers in my field.",
                },
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#00040A] text-white p-6 rounded-lg shadow-xl"
                >
                  <p className="text-lg mb-4 italic">"{story.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4">
                      {story.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{story.name}</h4>
                      <p className="text-blue-400">
                        {story.role} at {story.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CTABanner />

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-[#00040A] to-[#001636]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Our Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <ChatBoat />
    </div>
  );
};

export default Home;
