import { models } from "@yahalom-tests/common";
import PDFDocument from "pdfkit";

const distanceMargin = 18;
const maxWidth = 140;
const maxHeight = 70;
const lineSize = 174;
const signatureHeight = 390;

export function createCertificate({ firstName, lastName }: Omit<models.interfaces.Student, "email">) {
    const studentName = `${firstName} ${lastName}`;
    const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
    });
    // doc.pipe(res);
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");
    doc.fontSize(10);

    // Margin
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

    // Header
    const img = require.resolve("../../assets/winners.png");
    console.log(img);
    doc.image(img, doc.page.width / 2 - maxWidth / 2, 60, {
        fit: [maxWidth, maxHeight],
        align: "center",
    });

    jumpLine(doc, 5);

    doc.fontSize(10) //.font("fonts/NotoSansJP-Light.otf")
        .fill("#021c27")
        .text("NAME OF COURSE", { align: "center" });

    jumpLine(doc, 2);

    // Content
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
        .text("Successfully completed TEST NAME.", { align: "center" });

    jumpLine(doc, 7);

    doc.lineWidth(1);

    // Signatures
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

    doc.fontSize(10) //.font("fonts/NotoSansJP-Bold.otf")
        .fill("#021c27")
        .text("TEACHER NAME", startLine1, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10) //.font("fonts/NotoSansJP-Light.otf")
        .fill("#021c27")
        .text("Professor", startLine1, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10) //.font("fonts/NotoSansJP-Bold.otf")
        .fill("#021c27")
        .text(studentName, startLine2, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10) //.font("fonts/NotoSansJP-Light.otf")
        .fill("#021c27")
        .text("Student", startLine2, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10) //.font("fonts/NotoSansJP-Bold.otf")
        .fill("#021c27")
        .text("Yahalom Tests", startLine3, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    doc.fontSize(10) //.font("fonts/NotoSansJP-Light.otf")
        .fill("#021c27")
        .text("Test platform", startLine3, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
        });

    // jumpLine(doc, 4);

    // doc.end();
    return doc;
}

// Helper to move to next line
function jumpLine(doc: PDFKit.PDFDocument, lines: number) {
    for (let index = 0; index < lines; index++) {
        doc.moveDown();
    }
}
