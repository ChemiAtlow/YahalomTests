import { models } from "@yahalom-tests/common";
import { questionService, testService, organizationService, studentService } from ".";
import { examRepository } from "../DAL";
import { BadRequestError, ItemNotInDbError } from "../errors";
import { types } from "../models";

export const createNewExam = async (
    testId: models.classes.guid,
    studentEmail: models.classes.guid
) => {
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
    return exam;
};

export const isExamLocked = async (id: models.classes.guid) => {
    const exam = await examRepository.getItemById(id);
    if (!exam) {
        throw new ItemNotInDbError(id, "Exam");
    }
    return exam.completed;
};

export const getExamById = async (id: models.classes.guid) => {
    const exam = await examRepository.getItemById(id);
    if (!exam) {
        throw new ItemNotInDbError(id, "Exam");
    }
    return exam;
};

export const saveExamChanges = async (
    examId: models.classes.guid,
    { questionId, answers }: models.dtos.ExamChangeDto
) => {
    const exam = await getExamById(examId);
    const question = exam.questions.find(q => q.questionId === questionId);
    if (!question) {
        throw new BadRequestError("The exam doesn't contain this question!");
    }
    question.answers.forEach((a, i) => {
        a.correct = answers.includes(i); //check if the answer selected by user
    });
    await examRepository.updateItem(examId, { questions: exam.questions });
};

export const lockExam = async (examId: models.classes.guid) => {
    const { questions } = await getExamById(examId);
    const originalQuestions = await Promise.all(
        questions.map(async ({ questionId }) => await questionService.getQuestionById(questionId))
    );
    const [grade, correctAnswersCount] = calculateGrade(questions, originalQuestions);
    return await examRepository.updateItem(examId, { completed: Date.now(), grade, correctAnswersCount });
};

export const getAllExamResultsOfTest = async (testId: models.classes.guid) => {
    const exams = await examRepository.getAll();
    const reducedExams = await exams.reduce(async (prev, current) => {
        return current.test === testId ? [...await prev, await getExamResult(current)] : prev;
    }, Promise.resolve(Array<models.interfaces.ExamResult>()));
    return reducedExams;
};

export const getAllExamResultsOfStudent = async (email: string, organizationId: models.classes.guid) => {
    const exams = await examRepository.getAll();
    //this functions should filtered asynchronously the exams.
    const reducedExams = await exams.reduce(async (prev, current) => {
        const isExamOfStudentAndOrg = current.student === email &&
            (await organizationService.getOrganizationByTestId(current.test)).id === organizationId;
        return isExamOfStudentAndOrg ? [... await prev, await getExamResult(current)] : prev;
    }, Promise.resolve(Array<models.interfaces.ExamResult>()));

    return reducedExams;
};

export const getExamResult: types.ExamResultFn = async (exam: models.classes.guid | models.interfaces.Exam) => {
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
    if (isExamNotId) {
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

const shuffleArray = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

//return grade and correct answers count
const calculateGrade: (
    answeredQuestions: models.interfaces.AnsweredQuestion[],
    originalQuestions: models.interfaces.Question[]
) => [number, number] = (answeredQuestions, originalQuestions) => {
    let correctQuestionCount = 0;
    answeredQuestions.forEach(({ answers, questionId }) => {
        //find the question on the test
        const { answers: originalAnswers } = originalQuestions.find(q => q.id === questionId)!;
        //check if user answered write
        const isQuestionAnsweredCorrect = answers.every(
            (a, i) => a.correct === originalAnswers[i].correct
        );
        if (isQuestionAnsweredCorrect) {
            //counting correct question
            correctQuestionCount++;
        }
    });
    //calculate grade
    let grade = Math.ceil((correctQuestionCount / originalQuestions.length) * 100);
    return [grade, correctQuestionCount];
};
