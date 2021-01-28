import { models } from "@yahalom-tests/common";
import { questionService, testService } from ".";
import { examRepository } from "../DAL";
import { BadRequestError, ItemNotInDbError } from "../errors";

export const createNewExam = async (
    testId: models.classes.guid,
    studentEmail: models.classes.guid
) => {
    //if there is no test with this id - testService will throw an exception.
    const { intro, language, title, questions } = await testService.getTestsById(testId);
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
    return await examRepository.updateItem(examId, { completed: Date.now() });
};

export const getAllExamsOfTest = async (testId: models.classes.guid) => {
    const exams = await examRepository.getAll();
    return exams.filter(ex => ex.test === testId);
};

export const getExamResult = async (examId: models.classes.guid) => {
    const exam = await getExamById(examId);
    const {
        questions,
        successEmail,
        successMessage,
        failureEmail,
        failureMessage,
        isReviewEnabled,
        minPassGrade,
        teacherEmail,
    } = await testService.getTestsById(exam.test);
    const originalQuestions = await Promise.all(
        questions.map(async qId => await questionService.getQuestionById(qId))
    );
    const [grade, correctAnswersCount] = calculateGrade(exam.questions, originalQuestions);
    //check if garde > minPass grade...
    const messages: { message: string; email: models.interfaces.Email } = {
        message: "",
        email: { body: "", subject: "" },
    };
    if (grade > minPassGrade) {
        messages.message = successMessage;
        messages.email = successEmail;
    } else {
        messages.message = failureMessage;
        messages.email = failureEmail;
    }
    let result: models.interfaces.ExamResult = {
        message: messages.message,
        isReviewEnabled,
        grade,
        questionCount: exam.questions.length,
        correctAnswersCount,
    };
    if (isReviewEnabled) {
        result.originalQuestions = originalQuestions;
        result.answeredQuestions = exam.questions;
    }
    return { result, email: messages.email, teacherEmail, completionDate: exam.completed }; //seperate between UI and server props
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
            answers.forEach(a => (a.correct = false));
            return { alignment, answers, questionId: qId, title, type, additionalContent };
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
