import { createTransport, createTestAccount, getTestMessageUrl } from "nodemailer";
import { constants, models } from "@yahalom-tests/common";
import { appLoggerService } from ".";
const { clientDomain, clientPort, serverDomain, serverPort } = constants.URLS;

export const sendTestStatusEmail = async (
    { body, subject }: models.interfaces.Email,
    testName: string,
    { firstName, lastName, email }: Pick<models.interfaces.Student, "email" | "firstName" | "lastName">,
    completionDate: number,
    grade: number,
    examId: models.classes.guid,
    teacherEmail: string
) => {
    appLoggerService.verbose("Send test completion email to student and teacher");
    const parsedBody = body
    .replace(/@TestName@/g, testName)
    .replace(/@FirstName@/g, firstName)
    .replace(/@LastName@/g, lastName)
    .replace(/@Date@/g, new Date(completionDate).toLocaleString())
    .replace(/@Grade@/g, `${grade}`)
    .replace(/@Certificate@/g, `${serverDomain}:${serverPort}/exam/${examId}/cert`);
        
    const msg = { subject, body: parsedBody, plainBody: getMsgPlainText(parsedBody) };
    appLoggerService.verbose("Test completion bosy was parsed correctly, and will now be sent.", { msg }); 
    await sendEmail(`${email}, ${teacherEmail}`, msg);
    appLoggerService.verbose("Email sent correctly.", { msg }); 
};

export const sendSignUpEmail = async (emailAddress: string) => {
    appLoggerService.verbose("Send an email to user on signup", { emailAddress });
    const body = `<p>Hi there ${emailAddress}!</p><p>You can now log in to <a href="${clientDomain}:${clientPort}/login">Yahalom tests</a>.</p><p><b>Please note</b>, before you can use the system, your organization administrator has to connect your account to the organization.</p>`;
    const msg: models.interfaces.Email = {
        subject: "Welcome to Yahalom tests!",
        body,
        plainBody: getMsgPlainText(body),
    };
    appLoggerService.verbose("Email for new user was built.", { msg });
    await sendEmail(emailAddress, msg);
};

export const sendPasswordResetEmail = async (emailAddress: string, resetToken: string) => {
    appLoggerService.verbose("Send an email to user with reset token", { emailAddress });
    const resetUrl = `${clientDomain}:${clientPort}/reset/${resetToken}`;
    const body = `<p>Hi there ${emailAddress}!</p><p>A password reset was requested fot this account. If you did not request the reset, simply ignore this email.</p><p>In order to reset your password please <a href="${resetUrl}">click here</a>.</p><p>If the link does not work, copy this link to the browser: ${resetUrl}</p>`;
    const msg: models.interfaces.Email = {
        subject: "Yahalom tests - password reset",
        body,
        plainBody: getMsgPlainText(body),
    };
    appLoggerService.verbose("Email for reset password was built.", { msg });
    await sendEmail(emailAddress, msg);
};

const getMsgPlainText = (text: string) => {
    const stripped = text.replace(/(<\/p>|<br \/>)/g, "\n").replace(/<\/?[a-z]+( [a-z\-]+=".*")*>/g, "");
    appLoggerService.verbose("Strip message from HTML tags", { text, stripped });
    return stripped;
};

const sendEmail = async (to: string, email: models.interfaces.Email) => {
    appLoggerService.verbose("Start generating a transporter, to send email", { to, email });
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
    appLoggerService.verbose("Generated fake account and transporter", { ...testAccount });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Yahalom tests 👨🏽‍🏫" <info@y-tests.io>',
        to,
        subject: email.subject,
        text: email.plainBody,
        html: email.body,
    });
    appLoggerService.verbose("Email was sent", { msgId: info.messageId });
    appLoggerService.verbose(`Preview sent Email: ${getTestMessageUrl(info)}`, { info });
};
