import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { examController } from "../controllers";
import { validationMiddleware } from "../middleware";

export const router = Router();

//Ensure a test exists and an exam can be built for it.
router.get("/validate-test/:id", examController.checkIfTestExist);

//Create new exam for a given Test ID.
router.post("/new/:id", validationMiddleware(models.dtos.StudentDto), examController.createExam);

//Get an exam with given exam ID.
router.get("/:id", examController.getExam);

//Update an exam with given exam ID.
router.put("/:id", validationMiddleware(models.dtos.ExamChangeDto), examController.updateExam);

//Submit an exam
router.get("submit/:id", examController.submitExam);

//Get exam certificate by exam id
router.get("/:id/cert", examController.getExamPassedCertificate);
