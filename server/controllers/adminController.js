import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("userId", "fullname email")
      .lean();
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name description _id")
      .populate("created_by", "fullname email")
      .populate({
        path: "applications",
        populate: { path: "applicant", select: "fullname email" },
      })
      .lean();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "job",
        select: "title company",
        populate: { path: "company", select: "name" },
      })
      .populate("applicant", "fullname email")
      .lean();
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    if (!applicationId || !status) {
      return res.status(400).json({
        success: false,
        message: "Application ID and status are required",
      });
    }
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    application.status = status;
    await application.save();
    const updatedApplication = await Application.findById(applicationId)
      .populate({
        path: "job",
        select: "title company",
        populate: { path: "company", select: "name" },
      })
      .populate("applicant", "fullname email")
      .lean();
    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        message: "User is not authenticated.",
        success: false,
      });
    }
    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required.",
        success: false,
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    await Company.findByIdAndDelete(companyId);
    await Job.deleteMany({ company: companyId });
    await Application.deleteMany({
      job: { $in: await Job.find({ company: companyId }).select("_id") },
    });

    const remainingCompanies = await Company.find()
      .populate("userId", "fullname email")
      .lean();
    res.status(200).json({
      success: true,
      message:
        "Company, associated jobs, and applications deleted successfully.",
      data: remainingCompanies,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        message: "User is not authenticated.",
        success: false,
      });
    }
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    await Job.findByIdAndDelete(jobId);
    await Application.deleteMany({ job: jobId });

    const remainingJobs = await Job.find()
      .populate("company", "name description _id")
      .populate("created_by", "fullname email")
      .populate({
        path: "applications",
        populate: { path: "applicant", select: "fullname email" },
      })
      .lean();
    res.status(200).json({
      success: true,
      message: "Job and associated applications deleted successfully.",
      data: remainingJobs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
