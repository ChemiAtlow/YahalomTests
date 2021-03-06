import { models } from "@yahalom-tests/common";
import PDFDocument from "pdfkit";
import { appLoggerService } from ".";

const distanceMargin = 18;
const maxWidth = 140;
const maxHeight = 70;
const lineSize = 174;
const signatureHeight = 390;

export function createCertificate({
        firstName,
        lastName,
    }: Pick<models.interfaces.Student, "firstName" | "lastName">,
    testTitle: string,
    teacherEmail: string) {
    appLoggerService.verbose("Start creating certificate for student", { firstName, lastName, testTitle, teacherEmail });
    const studentName = `${firstName} ${lastName}`;
    const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
    });
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");
    doc.fontSize(10);

    //#region Border
    appLoggerService.verbose("Generate certificate border");
    doc.fillAndStroke("#0e8cc3")
    .lineWidth(20)
        .lineJoin("round")
        .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2
            )
            .stroke();
            //#endregion
            
    //#region Header
    appLoggerService.verbose("Generate certificate Header");
    const img = require.resolve("../../assets/winners.png");
    doc.image(img, doc.page.width / 2 - maxWidth / 2, 60, {
        fit: [maxWidth, maxHeight],
        align: "center",
    });
    
    jumpLine(doc, 5);

    doc.fontSize(10) 
    .fill("#021c27")
    .text(testTitle, { align: "center" });
    
    jumpLine(doc, 2);
    //#endregion
    
    //#region Content
    appLoggerService.verbose("Generate certificate Content");
    doc.fontSize(16) //.font("fonts/NotoSansJP-Regular.otf")
    .fill("#021c27")
        .text("CERTIFICATE OF COMPLETION", { align: "center" });
        
    jumpLine(doc, 1);
    
    doc.fontSize(10) //.font("fonts/NotoSansJP-Light.otf")
    .fill("#021c27")
    .text("Present to", { align: "center" });
    
    jumpLine(doc, 2);
    
    doc.fontSize(24) //.font("fonts/NotoSansJP-Bold.otf")
    .fill("#021c27")
    .text(studentName, { align: "center" });
    
    jumpLine(doc, 1);
    
    doc.fontSize(10) //.font("fonts/NotoSansJP-Light.otf")
    .fill("#021c27")
    .text(`Successfully completed ${testTitle}.`, { align: "center" });
        
    jumpLine(doc, 7);
    
    doc.lineWidth(1);
    //#endregion
    
    //#region Signatures
    appLoggerService.verbose("Generate certificate Signatures");
    doc.fillAndStroke("#021c27");
    doc.strokeOpacity(0.2);

    const startLine1 = 128;
    const endLine1 = 128 + lineSize;
    doc.moveTo(startLine1, signatureHeight)
    .lineTo(endLine1, signatureHeight)
    .stroke();

    const startLine2 = endLine1 + 32;
    const endLine2 = startLine2 + lineSize;
    doc.moveTo(startLine2, signatureHeight)
        .lineTo(endLine2, signatureHeight)
        .stroke();
    
    const startLine3 = endLine2 + 32;
    const endLine3 = startLine3 + lineSize;
    doc.moveTo(startLine3, signatureHeight)
    .lineTo(endLine3, signatureHeight)
    .stroke();
        
    doc.fontSize(10)
        .fill("#021c27")
        .text(teacherEmail, startLine1, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10)
        .fill("#021c27")
        .text("Professor", startLine1, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });
        
    doc.fontSize(10)
        .fill("#021c27")
        .text(studentName, startLine2, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });
        
    doc.fontSize(10)
        .fill("#021c27")
        .text("Student", startLine2, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });
        
    doc.fontSize(10)
        .fill("#021c27")
        .text("Yahalom Tests", startLine3, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10)
        .fill("#021c27")
        .text("Test platform", startLine3, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });
    //#endregion

    //#region Footer
    appLoggerService.verbose("Generate certificate Footer");
    jumpLine(doc, 4);
    const bottomHeight = doc.page.height - 140;
    const stamp = require.resolve("../../assets/stamp.png");
    doc.image(stamp, doc.page.width / 2 - 50, bottomHeight, {
        fit: [100, 100],
    });
    //#endregion
    return doc;
}

// Helper to move to next line
function jumpLine(doc: PDFKit.PDFDocument, lines: number) {
    appLoggerService.verbose(`jumping ${lines} lines in pdf certificate.`);
    for (let index = 0; index < lines; index++) {
        doc.moveDown();
    }
}
