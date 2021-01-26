import { Router } from "express";
// import { models } from "@yahalom-tests/common";
import { examController } from "../controllers";

export const router = Router();


//Get tests by id
router.get("/:id/cert", examController.getExamPassedCertificate);
