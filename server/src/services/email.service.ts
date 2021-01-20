import { createTransport, createTestAccount, getTestMessageUrl } from "nodemailer";
import { constants, models } from "@yahalom-tests/common";
const { clientDomain, clientPort } = constants.URLS;

export const sendTestStatusEmail = async (
    { body, subject }: models.interfaces.Email,
    testName: string,
    { firstName, lastName, email }: models.interfaces.Student,
    completionDate: number,
    grade: number,
    examId: models.classes.guid,
    teacherEmail: string
) => {
    const parsedBody = body
        .replace(/@TestName@/g, testName)
        .replace(/@FirstName@/g, firstName)
        .replace(/@LastName@/g, lastName)
        .replace(/@Date@/g, new Date(completionDate).toLocaleString())
        .replace(/@Grade@/g, `${grade}`)
        .replace(/@Certificate@/g, `${clientDomain}:${clientPort}/certificate/${examId}`);

    const msg = { subject, body: parsedBody, plainBody: getMsgPlainText(parsedBody) };
    await sendEmail(`${email}, ${teacherEmail}`, msg);
};

export const sendSignUpEmail = async (emailAddress: string) => {
    const body = `<p>Hi there ${emailAddress}!</p><p>You can now log in to <a href="${clientDomain}:${clientPort}/login">Yahalom tests</a>.</p><p><b>Please note</b>, before you can use the system, your organization administrator has to connect your account to the organization.</p>`;
    const message: models.interfaces.Email = {
        subject: "Welcome to Yahalom tests!",
        body,
        plainBody: getMsgPlainText(body),
    };
    await sendEmail(emailAddress, message);
};
export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
    const resetUrl = `${clientDomain}:${clientPort}/reset/${resetToken}`;
    const body = `<p>Hi there ${emailAddress}!</p><p>A password reset was requested fot this account. If you did not request the reset, simply ignore this email.</p><p>In order to reset your password please <a href="${resetUrl}">click here</a>.</p><p>If the link does not work, copy this link to the browser: ${resetUrl}</p>`;
    const message: models.interfaces.Email = {
        subject: "Yahalom tests - password reset",
        body,
        plainBody: getMsgPlainText(body),
    };
    await sendEmail(emailAddress, message);
};

const getMsgPlainText = (text: string) =>
    text.replace(/(<\/p>|<br \/>)/g, "\n").replace(/<\/?[a-z]+( [a-z\-]+=".*")*>/g, "");

const sendEmail = async (to: string, email: models.interfaces.Email) => {
    const testAccount = await createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Yahalom tests 👨🏽‍🏫" <info@y-tests.io>',
        to, //: "bar@example.com, baz@example.com"
        subject: email.subject,
        text: email.plainBody,
        html: email.body,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", getTestMessageUrl(info));
};
