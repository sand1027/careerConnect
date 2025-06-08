import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Building,
  Clock,
  IndianRupee,
  Share2,
  Briefcase,
  Users,
  Award,
} from "lucide-react";
import {
  USER_API_END_POINT,
  JOB_API_END_POINT,
  APPLICATION_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { setsavedJobs } from "@/redux/authSlice";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { savedJobs, user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data); // Debug: Log the full API response
        if (res.data.success) {
          const jobData = res.data.job;
          console.log("Job Data:", jobData); // Debug: Log the job data
          console.log("Company Data:", jobData.company); // Debug: Log the company field
          if (!jobData.company || !jobData.company.name) {
            console.warn(
              "Company data is missing or incomplete. Job Data:",
              jobData
            );
            toast.warning("Company information is missing for this job.");
            // Ensure company is null if incomplete to control rendering
            jobData.company = null;
          }
          dispatch(setSingleJob(jobData));
          setIsApplied(
            jobData.applications?.some(
              (application) => application.applicant === user?._id
            ) || false
          );
        } else {
          throw new Error(res.data.message || "Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError(error.response?.data?.message || "Failed to load job details");
        toast.error(
          error.response?.data?.message || "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...(singleJob.applications || []),
              { applicant: user?._id },
            ],
          })
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while applying"
      );
    }
  };

  const handleSaveForLater = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/savedjob`,
        { jobId },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setsavedJobs(res.data.savedJobs));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving job");
    }
  };

  const shareJob = () => {
    const jobUrl = window.location.href;
    navigator.clipboard.writeText(jobUrl);
    toast.success("Job link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#00040A] to-[#001636] min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#00040A] to-[#001636] min-h-screen text-white flex items-center justify-center">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-semibold text-red-400">Error</h2>
          <p className="text-gray-300 mt-2">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-gradient-to-br from-[#00040A] to-[#001636] min-h-screen text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {singleJob?.title || "Job Title"}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-400 mt-2">
                    {singleJob?.location || "Location"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {savedJobs?.some(
                    (savedJob) => savedJob._id === singleJob?._id
                  ) ? (
                    <Button className="bg-green-600 hover:bg-green-700 text-white text-sm w-full sm:w-auto">
                      Saved
                    </Button>
                  ) : (
                    <Button
                      className="bg-blue-700 hover:bg-blue-800 text-white text-sm w-full sm:w-auto"
                      onClick={handleSaveForLater}
                    >
                      Save Job
                    </Button>
                  )}
                  <Button
                    className={`text-sm w-full sm:w-auto rounded-lg px-6 py-3 ${
                      isApplied
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-white border-gray-600 hover:bg-gray-700"
                    onClick={shareJob}
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <MapPin className="h-5 w-5" />
                  </motion.div>
                  {singleJob?.location || "Not specified"}
                </div>
                <div className="flex items-center text-gray-300">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <Building className="h-5 w-5" />
                  </motion.div>
                  {singleJob?.jobType || "Not specified"}
                </div>
                <div className="flex items-center text-gray-300">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <Clock className="h-5 w-5" />
                  </motion.div>
                  {singleJob?.createdAt?.split("T")[0] || "Not specified"}
                </div>
                <div className="flex items-center text-gray-300">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <IndianRupee className="h-5 w-5" />
                  </motion.div>
                  {singleJob?.salary
                    ? `${singleJob.salary} LPA`
                    : "Not Disclosed"}
                </div>
              </div>

              {/* Job Description */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Job Description
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {singleJob?.description || "No description available"}
                </p>
              </section>

              {/* Requirements (Including Skills) */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Requirements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(singleJob?.requirements || ["Not specified"]).map(
                    (req, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
                      >
                        {req}
                      </span>
                    )
                  )}
                </div>
              </section>

              {/* Benefits */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Award className="h-5 w-5" />,
                      text: "Health & Wellness Programs",
                    },
                    {
                      icon: <Briefcase className="h-5 w-5" />,
                      text: "Career Growth Opportunities",
                    },
                    {
                      icon: <Users className="h-5 w-5" />,
                      text: "Inclusive Work Culture",
                    },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <span className="mr-2">{benefit.icon}</span>
                      {benefit.text}
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Company Overview (Conditionally Rendered) */}
              {singleJob?.company && singleJob.company.name && (
                <section className="mb-8">
                  <h2 className=" personally-identifiable-information">
                    About {singleJob.company.name}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {singleJob.company.description ||
                      "No description available."}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={
                        singleJob.company.logo ||
                        "https://via.placeholder.com/80"
                      }
                      alt={singleJob.company.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="text-gray-300">
                        Industry:{" "}
                        {singleJob.company.industry || "Not specified"}
                      </p>
                      <p className="text-gray-300">
                        Size: {singleJob.company.size || "Not specified"}{" "}
                        employees
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Similar Jobs (Placeholder) */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Similar Jobs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array(2)
                    .fill()
                    .map((_, index) => (
                      <Card key={index} className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-white">
                          Software Engineer
                        </h3>
                        <p className="text-gray-400 text-sm">
                          TechCorp • Remote
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                        >
                          View Job
                        </Button>
                      </Card>
                    ))}
                </div>
              </section>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JobDescription;
