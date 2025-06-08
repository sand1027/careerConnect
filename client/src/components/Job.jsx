import { Button } from "./ui/button";
import { BookmarkPlus, ArrowUpRight, Tag } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { setsavedJobs } from "@/redux/authSlice";

const Job = ({ job }) => {
  const { savedJobs } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveForLater = async (jobId) => {
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/savedjob`,
        { jobId },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setsavedJobs(response.data.savedJobs));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving job");
    }
  };

  const applicantPercentage =
    Math.min((job?.applications?.length || 0) / 100, 1) * 100;

  return (
    <motion.div
      className="flex items-stretch gap-4 p-4"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 w-full p-6 rounded-xl shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={job?.company?.logo || "https://via.placeholder.com/80"}
                alt={job?.company?.name}
              />
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white">{job?.title}</h3>
              <p className="text-gray-400 text-sm">{job?.company?.name}</p>
              <p className="text-gray-500 text-xs">
                Industry: {job?.company?.industry || "Not specified"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSaveForLater(job._id)}
          >
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <BookmarkPlus className="h-5 w-5 text-gray-400" />
            </motion.div>
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {job?.jobType || "Full-time"}
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-white">
              {job?.locationType || "On-site"}
            </Badge>
            <Badge variant="secondary">{job?.position || 1} Position</Badge>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Tag className="h-4 w-4 mr-2" />
            {job?.location}
          </div>
          <p className="text-gray-300 font-medium">
            ₹ {job?.salary || "Not Disclosed"} LPA
          </p>
          <p className="text-gray-400 text-sm">
            Deadline:{" "}
            {job?.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "Open until filled"}
          </p>
          <div className="text-gray-400 text-sm">
            Applicants: {job?.applications?.length || 0}
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${applicantPercentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {savedJobs?.some(
            (savedJob) => savedJob._id.toString() === job?._id.toString()
          ) ? (
            <Button className="bg-green-600 text-white text-sm">Saved</Button>
          ) : (
            <Button
              className="bg-blue-700 text-white text-sm"
              onClick={() => handleSaveForLater(job._id)}
            >
              Save Job
            </Button>
          )}
          <span className="text-sm text-gray-400">
            {daysAgoFunction(job?.createdAt) === 0
              ? "Today"
              : `${daysAgoFunction(job?.createdAt)} days ago`}
          </span>
          <Button
            className="text-blue-400 text-sm"
            variant="ghost"
            onClick={() => navigate(`/description/${job?._id}`)}
          >
            Details <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Job;
