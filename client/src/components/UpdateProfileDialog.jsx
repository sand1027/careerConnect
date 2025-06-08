import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  User,
  Briefcase,
  GraduationCap,
  X,
  Plus,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";

// Utility functions
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0].substring(0, 7);
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const UpdateProfileDialog = ({ open, setOpen, type, item, index }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(type || "profile");

  const initialInputState = {
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    location: user?.profile?.location || "",
    skills: user?.profile?.skills?.join(", ") || "",
    socialLinks: {
      linkedin: user?.profile?.socialLinks?.linkedin || "",
      github: user?.profile?.socialLinks?.github || "",
      twitter: user?.profile?.socialLinks?.twitter || "",
    },
    resume: null,
    experiences: user?.profile?.experience || [],
    educations: user?.profile?.education || [],
  };

  const [input, setInput] = useState(initialInputState);
  const [previewResume, setPreviewResume] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    if (file) {
      const validTypes = ["application/pdf"];
      if (!validTypes.includes(file.type)) {
        setFileError("Please upload only PDF files");
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError("File size should be less than 5MB");
        return;
      }
      setInput((prev) => ({ ...prev, resume: file }));
      setPreviewResume(file.name);
    }
  };

  const addExperience = () => {
    setInput({
      ...input,
      experiences: [
        ...input.experiences,
        {
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (idx, field, value) => {
    const updatedExperiences = [...input.experiences];
    updatedExperiences[idx] = { ...updatedExperiences[idx], [field]: value };
    setInput({ ...input, experiences: updatedExperiences });
  };

  const removeExperience = (idx) => {
    const updatedExperiences = input.experiences.filter((_, i) => i !== idx);
    setInput({ ...input, experiences: updatedExperiences });
  };

  const addEducation = () => {
    setInput({
      ...input,
      educations: [
        ...input.educations,
        { degree: "", institution: "", year: "" },
      ],
    });
  };

  const updateEducation = (idx, field, value) => {
    const updatedEducations = [...input.educations];
    updatedEducations[idx] = { ...updatedEducations[idx], [field]: value };
    setInput({ ...input, educations: updatedEducations });
  };

  const removeEducation = (idx) => {
    const updatedEducations = input.educations.filter((_, i) => i !== idx);
    setInput({ ...input, educations: updatedEducations });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Debug: Log email values to identify mismatch
      console.log("Email comparison:", {
        userEmail: user?.email,
        inputEmail: input.email,
      });

      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (
          key !== "experiences" &&
          key !== "educations" &&
          key !== "socialLinks" &&
          key !== "email" && // Email already excluded
          value !== null &&
          value !== undefined
        ) {
          if (key === "resume" && value instanceof File) {
            formData.append("file", value, value.name);
          } else if (key !== "resume") {
            formData.append(key, value);
          }
        }
      });
      formData.append("socialLinks", JSON.stringify(input.socialLinks));
      formData.append("experience", JSON.stringify(input.experiences));
      formData.append("education", JSON.stringify(input.educations));

      // Log FormData content
      console.log("FormData content:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] p-0 overflow-hidden bg-white rounded-xl shadow-2xl flex flex-col">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 sm:px-8 py-6 rounded-t-xl flex-shrink-0">
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-white">
            Update Your Profile
          </DialogTitle>
          <p className="text-white/90 text-base sm:text-lg mt-2">
            Build your professional presence
          </p>
        </DialogHeader>
        <Tabs
          defaultValue={activeTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="flex justify-center gap-2 px-4 sm:px-8 py-4 border-b bg-white flex-shrink-0">
            {[
              {
                value: "profile",
                label: "Profile",
                icon: <User className="w-4 h-4" />,
              },
              {
                value: "experience",
                label: "Experience",
                icon: <Briefcase className="w-4 h-4" />,
              },
              {
                value: "education",
                label: "Education",
                icon: <GraduationCap className="w-4 h-4" />,
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full pr-2">
            <form onSubmit={submitHandler}>
              <TabsContent value="profile" className="mt-0 outline-none">
                <div className="px-4 sm:px-8 py-6 space-y-6 pb-32">
                  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Full Name
                        </Label>
                        <Input
                          value={input.fullname}
                          onChange={(e) =>
                            setInput({ ...input, fullname: e.target.value })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          value={input.email}
                          readOnly
                          className="border-gray-300 bg-gray-50 cursor-not-allowed select-all"
                          placeholder="Your email address"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Email cannot be changed for security reasons
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label className="text-gray-700 font-medium">Bio</Label>
                      <Textarea
                        value={input.bio}
                        onChange={(e) =>
                          setInput({ ...input, bio: e.target.value })
                        }
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Phone Number
                        </Label>
                        <Input
                          value={input.phoneNumber}
                          onChange={(e) =>
                            setInput({ ...input, phoneNumber: e.target.value })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Location
                        </Label>
                        <Input
                          value={input.location}
                          onChange={(e) =>
                            setInput({ ...input, location: e.target.value })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Social Links
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          LinkedIn
                        </Label>
                        <Input
                          value={input.socialLinks.linkedin}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              socialLinks: {
                                ...input.socialLinks,
                                linkedin: e.target.value,
                              },
                            })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter LinkedIn URL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          GitHub
                        </Label>
                        <Input
                          value={input.socialLinks.github}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              socialLinks: {
                                ...input.socialLinks,
                                github: e.target.value,
                              },
                            })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter GitHub URL"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Twitter
                        </Label>
                        <Input
                          value={input.socialLinks.twitter}
                          onChange={(e) =>
                            setInput({
                              ...input,
                              socialLinks: {
                                ...input.socialLinks,
                                twitter: e.target.value,
                              },
                            })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter Twitter URL"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Professional Details
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Skills
                        </Label>
                        <Input
                          value={input.skills}
                          onChange={(e) =>
                            setInput({ ...input, skills: e.target.value })
                          }
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter skills (comma separated)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">
                          Resume
                        </Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {fileError && (
                            <p className="text-red-500 text-sm mt-2">
                              {fileError}
                            </p>
                          )}
                          {previewResume && !fileError && (
                            <p className="text-sm text-gray-600 mt-2 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              {previewResume}
                            </p>
                          )}
                        </div>
                        {user?.profile?.resume && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <span className="text-sm font-medium">
                                {user.profile.resumeOriginalName || "Resume"}
                              </span>
                            </div>
                            <a
                              href={user.profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="experience" className="mt-0 outline-none">
                <div className="px-4 sm:px-8 py-6 space-y-6 pb-32">
                  <div className="space-y-6">
                    {input.experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm relative hover:shadow-md transition-shadow duration-300"
                      >
                        <Button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">
                              Job Title
                            </Label>
                            <Input
                              value={exp.jobTitle}
                              onChange={(e) =>
                                updateExperience(
                                  idx,
                                  "jobTitle",
                                  e.target.value
                                )
                              }
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter job title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">
                              Company
                            </Label>
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(idx, "company", e.target.value)
                              }
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter company name"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">
                              Start Date
                            </Label>
                            <Input
                              type="month"
                              value={formatDateForInput(
                                exp.startDate
                              )?.substring(0, 7)}
                              onChange={(e) =>
                                updateExperience(
                                  idx,
                                  "startDate",
                                  `${e.target.value}-01`
                                )
                              }
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {exp.startDate && (
                              <p className="text-sm text-gray-500">
                                {formatDateForDisplay(exp.startDate)}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">
                              End Date
                            </Label>
                            <Input
                              type="month"
                              value={formatDateForInput(exp.endDate)?.substring(
                                0,
                                7
                              )}
                              onChange={(e) =>
                                updateExperience(
                                  idx,
                                  "endDate",
                                  `${e.target.value}-01`
                                )
                              }
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              min={formatDateForInput(exp.startDate)?.substring(
                                0,
                                7
                              )}
                            />
                            {exp.endDate && (
                              <p className="text-sm text-gray-500">
                                {formatDateForDisplay(exp.endDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Description
                          </Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(
                                idx,
                                "description",
                                e.target.value
                              )
                            }
                            className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Describe your responsibilities and achievements"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={addExperience}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-6 border-dashed border-2 hover:border-blue-500 hover:text-blue-600 transition-colors duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Add Experience
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="education" className="mt-0 outline-none">
                <div className="px-4 sm:px-8 py-6 space-y-6 pb-32">
                  <div className="space-y-6">
                    {input.educations.map((edu, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm relative hover:shadow-md transition-shadow duration-300"
                      >
                        <Button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">
                              Degree
                            </Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(idx, "degree", e.target.value)
                              }
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter degree name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">
                              Institution
                            </Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  idx,
                                  "institution",
                                  e.target.value
                                )
                              }
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter institution name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">
                            Year
                          </Label>
                          <Input
                            type="text" // Changed to text to match schema
                            value={edu.year}
                            onChange={(e) =>
                              updateEducation(idx, "year", e.target.value)
                            }
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter graduation year (e.g., 2023)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={addEducation}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-6 border-dashed border-2 hover:border-blue-500 hover:text-blue-600 transition-colors duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Add Education
                  </Button>
                </div>
              </TabsContent>
            </form>
          </div>
          <div className="border-t bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex-shrink-0">
            <div className="px-4 sm:px-8 py-4">
              <div className="flex justify-end items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-[100px] sm:w-[120px] h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={submitHandler}
                  className="w-[100px] sm:w-[120px] h-10 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
