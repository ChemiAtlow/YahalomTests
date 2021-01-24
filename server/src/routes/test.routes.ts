import { Router } from "express";
import { models } from "@yahalom-tests/common";
import { testController } from "../controllers";
import { validationMiddleware } from "../middleware";

export const router = Router();

//Get all tests
router.get("", testController.getAllTests);

//Get tests by id
router.get("/:id", testController.getTestById);

//Add test to the list in json
router.post("", validationMiddleware(models.dtos.TestDto), testController.addTest);

//Edit test
router.put("/:id", validationMiddleware(models.dtos.TestDto, true), testController.editTest);
