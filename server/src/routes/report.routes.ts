import { Router } from "express";
import { reportController } from "../controllers";

export const router = Router();

router.post("/test/:id", reportController.getTestReport);

router.post("/student/:id", reportController.getStudentReport);
