import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { questionsController } from "../controllers";
import { validationMiddleware, authMiddleware } from "../middleware";

export const router = Router();

//Get all questions
router.get("", authMiddleware, questionsController.getAllQuestions);

//Get question by id
router.get("/:id", authMiddleware, questionsController.getQuestionById);

//Add question to the list in json
router.post(
    "",
    authMiddleware,
    validationMiddleware(models.dtos.QuestionDto),
    questionsController.addQuestion
);

//Edit question
router.put(
    "/:id",
    validationMiddleware(models.dtos.QuestionDto, true),
    questionsController.editQuestion
);

//Delete question
router.delete("/:id", questionsController.deleteQuestion);
