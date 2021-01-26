import { Router } from "express";
import { reportController } from "../controllers";

export const router = Router();

router.get("/test/:id", reportController.getTestReport);

router.get("/student/:id", reportController.getStudentReport);
