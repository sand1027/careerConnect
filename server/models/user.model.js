import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String },
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
      savedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      experience: [
        {
          jobTitle: { type: String },
          company: { type: String },
          startDate: { type: Date },
          endDate: { type: Date },
          description: { type: String },
        },
      ],
      education: [
        {
          degree: { type: String },
          institution: { type: String },
          year: { type: String },
        },
      ],
      socialLinks: {
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
