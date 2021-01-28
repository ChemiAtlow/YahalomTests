import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { examController } from "../controllers";
import { validationMiddleware } from "../middleware";

export const router = Router();

//Get tests by id
router.get("/:id/cert", examController.getExamPassedCertificate);
router.get("/:id", examController.submitExam);
router.get("/validate-test/:id", examController.checkIfTestExist);
router.put("/:id", validationMiddleware(models.dtos.ExamChangeDto), examController.updateExam);
router.post("/new/:id", validationMiddleware(models.dtos.StudentDto), examController.createExam);
