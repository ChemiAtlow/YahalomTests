import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { testController } from "../controllers";
import { validationMiddleware, authMiddleware } from "../middleware";

export const router = Router();

//Get all tests
router.get("", authMiddleware, testController.getAllTests);

//Get tests by id
router.get("/:id", authMiddleware, testController.getTestById);

//Add test to the list in json
router.post(
    "",
    authMiddleware,
    validationMiddleware(models.dtos.TestDto),
    testController.addTest
);

//Edit test
router.put(
    "/:id",
    authMiddleware,
    validationMiddleware(models.dtos.TestDto, true),
    testController.editTest
);
