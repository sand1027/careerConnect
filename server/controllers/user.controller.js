import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role, phoneNumber } = req.body;
    console.log("Register request:", { fullname, email, role, phoneNumber });

    if (!fullname || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({
        message: "All required fields must be provided.",
        success: false,
      });
    }

    let profilePhotoUrl = null;
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        profilePhoto: newUser.profile.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Login request:", req.body);
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      console.log("Login validation failed: Missing fields");
      return res.status(400).json({
        message: "Email, password, and role are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log("Password mismatch:", email);
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      console.log("Role mismatch:", { email, role, userRole: user.role });
      return res.status(400).json({
        message: "Account doesn't exist with the specified role.",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("Update profile request:", {
      body: req.body,
      file: req.file,
      userId: req.id,
    });

    const {
      fullname,
      phoneNumber,
      bio,
      skills,
      socialLinks,
      experience,
      education,
      location,
    } = req.body;

    // Validate authentication
    if (!req.id) {
      console.error("Authentication error: No user ID provided");
      return res.status(401).json({
        message: "Authentication required.",
        success: false,
      });
    }

    // Validate required fields
    if (!fullname || !phoneNumber) {
      console.error("Validation error: Missing required fields", {
        fullname,
        phoneNumber,
      });
      return res.status(400).json({
        message: "Fullname and phone number are required.",
        success: false,
      });
    }

    // Convert phoneNumber to Number
    const phoneNumberNum = Number(phoneNumber);
    if (isNaN(phoneNumberNum)) {
      console.error("Validation error: Invalid phone number", { phoneNumber });
      return res.status(400).json({
        message: "Phone number must be a valid number.",
        success: false,
      });
    }

    // Safe JSON parsing
    let parsedSocialLinks = {};
    let parsedExperience = [];
    let parsedEducation = [];
    try {
      if (
        socialLinks &&
        typeof socialLinks === "string" &&
        socialLinks.trim()
      ) {
        parsedSocialLinks = JSON.parse(socialLinks);
        if (
          typeof parsedSocialLinks !== "object" ||
          Array.isArray(parsedSocialLinks)
        ) {
          throw new Error("socialLinks must be an object");
        }
      }
      if (experience && typeof experience === "string" && experience.trim()) {
        parsedExperience = JSON.parse(experience);
        if (!Array.isArray(parsedExperience)) {
          throw new Error("experience must be an array");
        }
      }
      if (education && typeof education === "string" && education.trim()) {
        parsedEducation = JSON.parse(education);
        if (!Array.isArray(parsedEducation)) {
          throw new Error("education must be an array");
        }
        // Ensure education.year is a string
        parsedEducation = parsedEducation.map((edu) => ({
          ...edu,
          year: edu.year ? String(edu.year) : undefined,
        }));
      }
    } catch (jsonError) {
      console.error("JSON parsing error:", {
        message: jsonError.message,
        field: jsonError.message.includes("socialLinks")
          ? "socialLinks"
          : jsonError.message.includes("experience")
          ? "experience"
          : "education",
        input: { socialLinks, experience, education },
      });
      return res.status(400).json({
        message: `Invalid JSON format in ${
          jsonError.message.includes("socialLinks")
            ? "socialLinks"
            : jsonError.message.includes("experience")
            ? "experience"
            : "education"
        }.`,
        success: false,
        error: jsonError.message,
      });
    }

    // Process skills
    let skillsArray = [];
    if (typeof skills === "string" && skills.trim()) {
      skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Find user
    const user = await User.findById(req.id);
    if (!user) {
      console.error("User not found:", req.id);
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Update fields (email is not updated)
    user.fullname = fullname;
    user.phoneNumber = phoneNumberNum;
    user.profile.bio = bio || user.profile.bio;
    user.profile.skills = skillsArray.length
      ? skillsArray
      : user.profile.skills;
    user.profile.socialLinks = Object.keys(parsedSocialLinks).length
      ? parsedSocialLinks
      : user.profile.socialLinks;
    user.profile.experience = parsedExperience.length
      ? parsedExperience
      : user.profile.experience;
    user.profile.education = parsedEducation.length
      ? parsedEducation
      : user.profile.education;
    if (location !== undefined) {
      user.profile.location = location;
    }

    // Handle resume upload
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        console.error("Invalid file type:", req.file.mimetype);
        return res.status(400).json({
          message: "Only PDF files are allowed for resume.",
          success: false,
        });
      }
      try {
        console.log("Uploading file to Cloudinary:", req.file.originalname);
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(
          fileUri.content,
          {
            resource_type: "raw",
            folder: "resumes",
          }
        );
        console.log("Cloudinary response:", cloudResponse);
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = req.file.originalname;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload resume to Cloudinary.",
          success: false,
          error: uploadError.message,
        });
      }
    }

    // Save user
    try {
      await user.save();
      console.log("User updated:", user._id);
    } catch (saveError) {
      console.error("Database save error:", saveError);
      return res.status(500).json({
        message: "Failed to save user profile.",
        success: false,
        error: saveError.message,
      });
    }

    // Sanitized response
    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: {
        bio: user.profile.bio,
        skills: user.profile.skills,
        resume: user.profile.resume,
        resumeOriginalName: user.profile.resumeOriginalName,
        company: user.profile.company,
        profilePhoto: user.profile.profilePhoto,
        savedJobs: user.profile.savedJobs,
        experience: user.profile.experience,
        education: user.profile.education,
        socialLinks: user.profile.socialLinks,
        location: user.profile.location,
      },
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: sanitizedUser,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const savedJobs = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.id;

    console.log("Save job request:", { jobId, userId });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (user.profile.savedJobs.includes(jobId)) {
      return res.status(400).json({
        message: "Job is already saved.",
        success: false,
      });
    }

    user.profile.savedJobs.push(jobId);
    await user.save();

    await user.populate("profile.savedJobs");
    return res.status(200).json({
      user,
      message: "Job saved successfully.",
      success: true,
      savedJobs: user.profile.savedJobs,
    });
  } catch (error) {
    console.error("Save job error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
