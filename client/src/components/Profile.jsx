import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Pen,
  Calendar,
  Plus,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobsTable from "./SavedJobsTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { motion } from "framer-motion";

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "Present";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch (error) {
    return dateString;
  }
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  let duration = "";
  const totalMonths = years * 12 + months;
  if (totalMonths >= 12) {
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    duration = `${y} ${y === 1 ? "year" : "years"}`;
    if (m > 0) duration += ` ${m} ${m === 1 ? "month" : "months"}`;
  } else {
    duration = `${totalMonths} ${totalMonths === 1 ? "month" : "months"}`;
  }
  return duration;
};

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [itemIndex, setItemIndex] = useState(null);
  const { user } = useSelector((store) => store.auth);

  const ProfileHeader = () => (
    <div className="relative mb-32 w-full">
      <div className="h-80 w-full bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>
      <div className="absolute -bottom-24 w-full px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/90 border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="w-32 h-32 rounded-full border-4 border-gray-700 shadow-lg">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s"
                    }
                    alt="Profile"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                  <Pen className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {user?.fullname || "Unknown User"}
                </h1>
                <p className="mt-2 text-gray-400 max-w-2xl">
                  {user?.profile?.bio || "No bio available."}
                </p>
                <div className="flex justify-center sm:justify-start mt-4 space-x-4">
                  <SocialLinks user={user} />
                </div>
              </div>
              <Button
                onClick={() => {
                  setEditType("profile");
                  setOpen(true);
                }}
                className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Pen className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const SocialLinks = ({ user }) => {
    const socialLinks = [
      {
        icon: Linkedin,
        url: user?.profile?.socialLinks?.linkedin,
        label: "LinkedIn",
      },
      {
        icon: Github,
        url: user?.profile?.socialLinks?.github,
        label: "GitHub",
      },
      {
        icon: Twitter,
        url: user?.profile?.socialLinks?.twitter,
        label: "Twitter",
      },
    ];

    return (
      <>
        {socialLinks.map((social, index) => {
          if (!social.url) return null;
          const Icon = social.icon;
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </>
    );
  };

  const ContactInfo = ({ user }) => (
    <div className="space-y-4">
      <InfoItem
        icon={<Mail className="w-5 h-5" />}
        label="Email"
        value={user?.email}
        isEmail
      />
      <InfoItem
        icon={<Phone className="w-5 h-5" />}
        label="Phone"
        value={user?.phoneNumber}
      />
      <InfoItem
        icon={<MapPin className="w-5 h-5" />}
        label="Location"
        value={user?.profile?.location}
      />
    </div>
  );

  const InfoItem = ({ icon, label, value, isEmail }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200">
      <div className="p-2.5 bg-blue-600/50 rounded-lg text-blue-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p
          className={`text-gray-300 truncate ${
            isEmail ? "select-all cursor-text" : ""
          }`}
        >
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  const ResumeSection = ({ user }) => (
    <div className="pt-6 border-t border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Resume</h2>
      {user?.profile?.resume ? (
        <a
          href={user.profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 text-blue-400 transition-colors duration-200"
        >
          <FileText className="w-5 h-5" />
          <span className="flex-1 truncate">
            {user.profile.resumeOriginalName || "View Resume"}
          </span>
          <Download className="w-5 h-5" />
        </a>
      ) : (
        <p className="text-gray-400 italic">No resume available</p>
      )}
    </div>
  );

  const SkillsSection = ({ skills }) => (
    <div className="pt-6 border-t border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </Badge>
          ))
        ) : (
          <span className="text-gray-400 italic">No skills listed</span>
        )}
      </div>
    </div>
  );

  const ExperienceSection = () => (
    <Card className="bg-gray-800 border-gray-700 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Experience
        </h2>
        {user?.profile?.experience?.length > 0 && (
          <Button
            onClick={() => {
              setEditType("experience");
              setItemIndex(null);
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Experience</span>
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {user?.profile?.experience?.length > 0 ? (
          user.profile.experience.map((exp, index) => (
            <div key={index} className="relative group">
              <div className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-blue-400 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)} •{" "}
                      {calculateDuration(exp.startDate, exp.endDate)}
                    </p>
                    <p className="mt-2 text-gray-300">{exp.description}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditType("experience");
                      setItemIndex(index);
                      setOpen(true);
                    }}
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 text-blue-400"
                  >
                    <Pen className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No experience listed yet"
            action={() => {
              setEditType("experience");
              setItemIndex(null);
              setOpen(true);
            }}
            actionLabel="Add Experience"
          />
        )}
      </div>
    </Card>
  );

  const EducationSection = () => (
    <Card className="bg-gray-800 border-gray-700 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
          Education
        </h2>
        {user?.profile?.education?.length > 0 && (
          <Button
            onClick={() => {
              setEditType("education");
              setItemIndex(null);
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Education</span>
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {user?.profile?.education?.length > 0 ? (
          user.profile.education.map((edu, index) => (
            <div key={index} className="relative group">
              <div className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-400 font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Class of {edu.year}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditType("education");
                      setItemIndex(index);
                      setOpen(true);
                    }}
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 text-blue-400"
                  >
                    <Pen className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No education listed yet"
            action={() => {
              setEditType("education");
              setItemIndex(null);
              setOpen(true);
            }}
            actionLabel="Add Education"
          />
        )}
      </div>
    </Card>
  );

  const EmptyState = ({ title, action, actionLabel }) => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Plus className="w-8 h-8 text-blue-400" />
      </div>
      <p className="text-gray-400 mb-4">{title}</p>
      <Button
        onClick={action}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {actionLabel}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00040A] to-[#001636] text-gray-300">
      <Navbar />
      <div className="w-full">
        <ProfileHeader />
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-gray-800 border-gray-700 rounded-2xl p-6 mb-6">
                  <ContactInfo user={user} />
                  <ResumeSection user={user} />
                  <SkillsSection skills={user?.profile?.skills || []} />
                </Card>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <ExperienceSection />
              <EducationSection />
              <Card className="bg-gray-800 border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Applied Jobs
                </h2>
                <AppliedJobTable />
              </Card>
              <Card className="bg-gray-800 border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Saved Jobs
                </h2>
                <SavedJobsTable />
              </Card>
            </div>
          </div>
        </div>
      </div>
      <UpdateProfileDialog
        open={open}
        setOpen={setOpen}
        type={editType}
        itemIndex={itemIndex}
      />
      <Footer />
    </div>
  );
};

export default Profile;
