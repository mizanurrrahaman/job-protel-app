import express from "express";
import { isAuthenticated, isAuthorized } from "../middlerwares/auth.js"
import { postJob, getAllJobs, getMyJobs, deleteJob, getASingleJob } from "../controller/jobController.js";



const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete("/delate/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get("/get/:id", isAuthenticated, getASingleJob)

export default router;