import { models } from "@yahalom-tests/common";
import { questionService, testService, organizationService, studentService, appLoggerService } from ".";
import { examRepository } from "../DAL";
import { BadRequestError, ItemNotInDbError } from "../errors";
import { types } from "../models";

export const createNewExam = async (
    testId: models.classes.guid,
    studentEmail: string
) => {
    appLoggerService.verbose("Create a new exam for student from a specific test", { studentEmail, testId });
    //if there is no test with this id - testService will throw an exception.
    const { intro, language, title, questions, minPassGrade } = await testService.getTestsById(testId);
    const examQuestions = await buildAnsweredQuesionsByExam(questions);
    const exam = await examRepository.addItem({
        id: "", //set by repo
        student: studentEmail,
        test: testId,
        timeStarted: Date.now(),
        intro,
        language,
        title,
        questions: examQuestions,
        minPassGrade
    });
    appLoggerService.verbose("Generated new exam for student", { exam });
    return exam;
};

export const isExamLocked = async (examId: models.classes.guid) => {
    appLoggerService.verbose("Check if an exam is locked", { examId });
    const exam = await examRepository.getItemById(examId);
    if (!exam) {
        appLoggerService.warn("Exam wasn't found!", { examId });
        throw new ItemNotInDbError(examId, "Exam");
    }
    const isLocked = Boolean(exam.completed);
    appLoggerService.verbose("Exam was found and now we know if is is locked or not", { isLocked });
    return isLocked;
};

export const getExamById = async (examId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to get exam by Id", { examId });
    const exam = await examRepository.getItemById(examId);
    if (!exam) {
        appLoggerService.warn("Attempt to get exam by Id failed - no exam has this Id", { examId });
        throw new ItemNotInDbError(examId, "Exam");
    }
    appLoggerService.verbose("Exam eas found successfully.", { exam });
    return exam;
};

export const saveExamChanges = async (
    examId: models.classes.guid,
    { questionId, answers }: models.dtos.ExamChangeDto
) => {
    appLoggerService.verbose("Changes were sent to exam", { examId, questionId, answers });
    const exam = await getExamById(examId);
    const question = exam.questions.find(q => q.questionId === questionId);
    if (!question) {
        appLoggerService.warn("Exam dosen't contain requested question", { exam, questionId });
        throw new BadRequestError("The exam doesn't contain this question!");
    }
    appLoggerService.verbose("Exam and question detected succesfully", { exam, question });
    question.answers.forEach((a, i) => {
        a.correct = answers.includes(i); //check if the answer selected by user
    });
    await examRepository.updateItem(examId, { questions: exam.questions });
    appLoggerService.verbose("Marked ans saved student's answers.");
};

export const lockExam = async (examId: models.classes.guid) => {
    appLoggerService.verbose("Attempt to lock an exam after calculating grade.", { examId });
    const { questions } = await getExamById(examId);
    const originalQuestions = await Promise.all(
        questions.map(async ({ questionId }) => await questionService.getQuestionById(questionId))
    );
    appLoggerService.verbose("Fetched original questions in order to compare.", { examId, questions, originalQuestions });
    const [grade, correctAnswersCount] = calculateGrade(questions, originalQuestions);
    const lockedExam = await examRepository.updateItem(examId, { completed: Date.now(), grade, correctAnswersCount });
    appLoggerService.verbose("Exam lock completed", { lockedExam });
    return lockedExam;
};

export const getAllExamResultsOfTest = async (testId: models.classes.guid, rangeStart = 0, rangeEnd = Date.now()) => {
    appLoggerService.verbose("Attempt to get all exam results of a specific test, in a given time range", { testId, rangeStart, rangeEnd });
    if (rangeEnd !== 0 && rangeStart >= rangeEnd) {
        appLoggerService.warn("The range is invalid!", { rangeStart, rangeEnd });
        throw new BadRequestError("Can't create a report for an invalid date range. start date must be prior to end date.");
    }
    rangeEnd = rangeEnd <= 0 ? Date.now() : rangeEnd;
    const exams = await examRepository.getAll();
    appLoggerService.verbose("Fetched all exams, will now reduce to get only relevant exams");
    const reducedExams = await exams.reduce(async (prev, current) => {
        const isInRange = current.timeStarted >= (rangeStart) && current.timeStarted <= rangeEnd;
        return current.test === testId && isInRange ? [...await prev, await getExamResult(current)] : prev;
    }, Promise.resolve(Array<models.interfaces.ExamResult>()));
    appLoggerService.verbose(`Reduced exams by date, found ${reducedExams.length} exams.`);
    return reducedExams;
};

export const getAllExamResultsOfStudent = async (email: string, organizationId: models.classes.guid) => {
    appLoggerService.verbose("Build exam results of specific student.", { email, organizationId });
    const exams = await examRepository.getAll();
    appLoggerService.verbose("Reduce fetched exams for specific student and organization.", { email, organizationId });
    //this functions should filtered asynchronously the exams.
    const reducedExams = await exams.reduce(async (prev, current) => {
        const isExamOfStudentAndOrg = current.student === email &&
            (await organizationService.getOrganizationByTestId(current.test)).id === organizationId;
        return isExamOfStudentAndOrg ? [... await prev, await getExamResult(current)] : prev;
    }, Promise.resolve(Array<models.interfaces.ExamResult>()));
    appLoggerService.verbose(`Reduced exams by student, found ${reducedExams.length} exams.`);
    return reducedExams;
};

export const getExamResult: types.ExamResultFn = async (exam: models.classes.guid | models.interfaces.Exam) => {
    appLoggerService.verbose("Build exam result for exam, or exam Id", { exam });
    const isExamNotId = typeof (exam) !== "string";
    const examToBuild = isExamNotId ? exam as models.interfaces.Exam : await getExamById(exam as models.classes.guid);
    const {
        id,
        test,
        questions,
        completed: completionDate = 0,
        student: studentEmail,
        grade = 0,
        correctAnswersCount = 0,
        minPassGrade
    } = examToBuild;
    appLoggerService.verbose("Got relevant data from exm, now load test", { test });
    const {
        title,
        intro,
        successEmail,
        successMessage,
        failureEmail,
        failureMessage,
        isReviewEnabled,
        teacherEmail,
    } = await testService.getTestsById(test);
    const originalQuestions = await Promise.all(
        questions.map(async ({ questionId }) => await questionService.getQuestionById(questionId))
    );
    const isGradePassing = grade > minPassGrade;
    const result: models.interfaces.ExamResult = {
        id,
        completionDate: completionDate || 0,
        message: isGradePassing ? successMessage : failureMessage,
        intro,
        title,
        minPassGrade,
        isReviewEnabled,
        grade,
        questionCount: questions.length,
        correctAnswersCount,
        originalQuestions: isReviewEnabled || isExamNotId ? originalQuestions : undefined,
        answeredQuestions: isReviewEnabled || isExamNotId ? questions : undefined,
    };
    appLoggerService.verbose("Built base result", { result });
    if (isExamNotId) {
        appLoggerService.verbose("Add the student name for report");
        const { firstName, lastName } = await studentService.getStudentByEmail(studentEmail);
        result.studentName = `${firstName} ${lastName}`;
        return result;
    }
    return {
        result, // UI data
        email: isGradePassing ? successEmail : failureEmail,
        teacherEmail,
        completionDate,
        title,
        studentEmail,
    } as any; //seperate between UI and server props
};

//get test questions and build examQuesions
const buildAnsweredQuesionsByExam = async (testQuestions: models.classes.guid[]) => {
    appLoggerService.verbose("Prepare the answered questions for an exam.");
    const examQuestions = await Promise.all(
        testQuestions.map<Promise<models.interfaces.AnsweredQuestion>>(async qId => {
            const {
                alignment,
                additionalContent,
                title,
                type,
                answers,
            } = await questionService.getQuestionById(qId);
            const cleanAnswers = answers.map<models.interfaces.Answer>(({ content }) => ({ content, correct: false }));
            return { alignment, answers: cleanAnswers, questionId: qId, title, type, additionalContent };
        })
    );
    return shuffleArray(examQuestions);
};

const shuffleArray = <T>(arr: T[]) => {
    appLoggerService.verbose("Shuffle an array", { arr });
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    appLoggerService.verbose("The array was shuffled!", { arr });
    return arr;
};

//return grade and correct answers count
const calculateGrade: (
    answeredQuestions: models.interfaces.AnsweredQuestion[],
    originalQuestions: models.interfaces.Question[]
) => [number, number] = (answeredQuestions, originalQuestions) => {
    appLoggerService.verbose("Start calculating student grade of exam", { answeredQuestions, originalQuestions });
    let correctQuestionCount = 0;
    answeredQuestions.forEach(({ answers, questionId }) => {
        //find the question on the test
        const { answers: originalAnswers } = originalQuestions.find(q => q.id === questionId)!;
        //check if user answered right
        const isQuestionAnsweredCorrect = answers.every(
            (a, i) => a.correct === originalAnswers[i].correct
        );
        if (isQuestionAnsweredCorrect) {
            //counting correct question
            correctQuestionCount++;
        }
    });
    appLoggerService.verbose(`Completed iteration over all answers, found ${correctQuestionCount} correct answers out of ${originalQuestions.length} questions`);
    //calculate grade
    let grade = Math.ceil((correctQuestionCount / originalQuestions.length) * 100);
    return [grade, correctQuestionCount];
};
