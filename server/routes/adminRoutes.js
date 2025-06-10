import express from "express";
import {
  getAllUsers,
  getUserByEmail,
  getAllCompanies,
  getAllJobs,
  deleteCompany,
  deleteJob,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:email", getUserByEmail);
router.get("/companies", getAllCompanies);
router.get("/jobs", getAllJobs);
router.get("/applications", getAllApplications);
router.post("/applications/update", updateApplicationStatus);
router.post("/companies/delete", deleteCompany);
router.post("/jobs/delete", deleteJob);

export default router;
