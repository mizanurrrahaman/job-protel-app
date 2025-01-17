import { deleteApplication, employerGetAllApplication, jobSeekerGetAllApplication, postApplication } from "../controller/applicationController.js";
import { isAuthenticated, isAuthorized } from "../middlerwares/auth.js";
import express from 'express';



const router = express.Router();

router.post("/post/:id", isAuthenticated, isAuthorized("Job Seeker"), postApplication );

router.get("/employer/getall", isAuthenticated, isAuthorized("Employer"), employerGetAllApplication);

router.get("/jobseeker/getall", isAuthenticated,isAuthorized("Job Seeker"), jobSeekerGetAllApplication);
-
router.delete("/delete/:id",isAuthenticated, deleteApplication );

export default router;