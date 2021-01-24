import { Request, Response } from "express";
import { certificationService } from "../services";

export const getExamPassedCertificate = (req: Request, res: Response) => {
    //TODO: Validate exam was actually passed successfully, and gather info for certificate.
    const doc = certificationService.createCertificate({
        firstName: "Reem",
        lastName: "Cohen",
    });
    doc.pipe(res);
    doc.end();
};
