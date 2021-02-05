import { models } from '@yahalom-tests/common';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { AppButton, SectionNavigator, Section, ErrorModal, QuestionPeekModal, WarningModal, MessageModal, FixedFooter } from '../../components';
import { QuestionDetails, QuestionAnswers } from './QuestionForm';
import { useAuth, useLoading, useModal } from "../../hooks";
import { questionService } from '../../services';
import "./EditQuestion.scoped.scss";
import type { QuestionDetailsErrors, QuestionDetailsKeys } from './QuestionForm/types';

interface EditParams {
    questionId?: models.classes.guid;
}
interface EditQuestionProps {
    onQuestionAddedOrEdited: (question: models.interfaces.Question) => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({ onQuestionAddedOrEdited }) => {
    const [question, setQuestion] = useState<models.dtos.QuestionDto>({
        title: "",
        additionalContent: "",
        type: models.enums.QuestionType.SingleChoice,
        answers: [{ content: "", correct: false }],
        label: "",
        alignment: models.enums.Alignment.Vertical,
    });
    const [detailsError, setDetailsError] = useState<QuestionDetailsErrors>({
        title: "",
        general: "",
        label: "",
    });
    const [answersError, setAnswersError] = useState("");
    const { activeStudyField, buildAuthRequestData } = useAuth();
    const { openModal } = useModal();
    const { setLoadingState } = useLoading();
    const { state } = useLocation<{ question?: models.dtos.QuestionDto }>();
    const { params } = useRouteMatch<EditParams>();
    const isInvalid = useMemo(() => Boolean(detailsError.general) || Boolean(answersError), [detailsError, answersError]);
    
    useEffect(() => {
        if (params.questionId && state?.question) {
            setQuestion(state.question);
        } else if (params.questionId && !state?.question) {
            // setLoadingState("loading"); ////// This currently causes re-render. this changes "params", need to figure out why.
            questionService.getQuestion(buildAuthRequestData(), params.questionId)
                .then(({ data }) => setQuestion(data))
                .catch(err => openModal(ErrorModal, {
                    title: "Error loading question",
                    body: `An error occoured while loading the question for editing:\n${err?.message || ""}`
                }))
                .finally(() => setLoadingState("success"));
        }
    }, [state, params, setQuestion, buildAuthRequestData, openModal, setLoadingState]);

    useEffect(() => {
        const { answers } = question;
        const answersLength = answers.length;
        const isAtLeast2Answers = answersLength < 2 || (answersLength === 2 && !answers[1].content.trim())
        const containsEmptyAnswers = answers.some(({ content }, i) => !content.trim() && i !== answersLength - 1);
        const containsNoCorrectAnswer = answers.every(({correct}) => !correct);
        const isAnEmptyAnswerCorrect = answers.some(({content, correct}) => !content.trim() && correct);
        const errors: string[] = [];
        //Check at least 2 questions exist
        if (isAtLeast2Answers) {
            errors.push("at least 2 answers are required");
        }
        //only last answer can be empty
        if (containsEmptyAnswers) {
            errors.push("Empty answers are invalid");
        }
        //empty answer can't be correct
        if (isAnEmptyAnswerCorrect) {
            errors.push("Empty answer can't be correct")
        }
        //no answer is marked as correct
        if (containsNoCorrectAnswer) {
            errors.push("At least one question must be correct")
        }
        let errMsg = "";
        if (errors.length === 1) {
            errMsg = `Error: ${errors[0]}`
        } else if (errors.length > 1) {
            errMsg = `Errors: ${errors.join(", ")}`
        }
        setAnswersError(errMsg);
        const isQuestionDetailsInvalid = !question.title.trim() || !/(\w+)(,\s*\w+)*/.test(question.label);
        const general = isQuestionDetailsInvalid ? "There are required details missing!" : ""
        setDetailsError(detailsError => ({ ...detailsError, general }));
    }, [question]);
    const onDetailsChange = (change: Partial<QuestionDetailsKeys>) => {
        if (change.title !== undefined) {
            const title = change.title.trim() ? "" : "Title is required!";
            setDetailsError({ ...detailsError, title });
        }
        if (change.label !== undefined) {
            const value = change.label;
            const label = !value.trim() ? "Label is required!" : !/(\w+)(,\s*\w+)*/.test(value) ? "Label must be a comma seperated string!" : "";
            setDetailsError({ ...detailsError, label });
        }
        onChange(change);
    }
    const onChange = async (e: Partial<models.dtos.QuestionDto>) => {
        const afterChange = { ...question, ...e };
        let doSave = true;
        if (e.type === models.enums.QuestionType.SingleChoice) {
            const correctAnswersCount = question.answers.filter(ans => ans.correct).length;
            doSave = await new Promise<boolean>((res, rej) => {
                if (correctAnswersCount > 1) {
                    afterChange.answers = afterChange.answers.map(({content}) => ({ content, correct: false }))
                    setTimeout(() => openModal(WarningModal, {
                        title: "Issue changing question type!",
                        body: `You tried changing a multi choice question to a single choice question.\nCurrently there are ${correctAnswersCount} answers marked as correct.\nProcceding with the change will mark all questions as incorrect.`,
                        okText: "Cancel",
                        cancelText: "Proceed changes"
                    }).promise.then(res).catch(rej), 0);
                } else {
                    res(true);
                }
            });
        }
        if (doSave) {
            setQuestion(afterChange);
        }
    }

    const buildQuestionForSendOrPreview = () => {
        const questionClone = { ...question };
        const { answers, label, title, additionalContent } = questionClone;
        questionClone.label = label.trim();
        questionClone.title = title.trim();
        questionClone.additionalContent = additionalContent?.trim();
        if (!answers[answers.length - 1]?.content.trim()) {
            answers.pop();
        }
        answers.forEach(ans => ans.content = ans.content.trim())
        return questionClone;
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isInvalid) {
            return;
        }
        //Show warning if multi choice has only one correct answer
        if (question.type === models.enums.QuestionType.MultiChoice && question.answers.filter(({ correct }) => correct).length === 1) {
            const warning = await openModal(WarningModal, {
                title: "Warning",
                cancelText: "Send anyway",
                okText: "Fix",
                body: "This question was marked as a multi choice question, but only one answer is marked as true.\nAre you sure you want to procced?"
            }).promise;
            if (!warning) {
                return;
            }
        }
        try {
            const questionToSend = buildQuestionForSendOrPreview();
            const authData = buildAuthRequestData();
            let savedQuestion: models.interfaces.Question;
            if (questionToSend.id) {
                const { data } = await questionService.editQuestion(authData, questionToSend.id, questionToSend)
                savedQuestion = data;
            } else {
                const { data } = await questionService.addQuestion(authData, questionToSend);
                savedQuestion = data;
            }
            openModal(MessageModal, { title: "Success!", children: `Question ${questionToSend.id ? "edited":"created"} successfully.`, okText: "OK" })
            onQuestionAddedOrEdited(savedQuestion)
        } catch (err) {
            openModal(ErrorModal, { title: "Saving question failed", body: err.message });
        }
    };

    const previewQuestion = () => {
        const question = buildQuestionForSendOrPreview();
        openModal(QuestionPeekModal, { question });
    }

    return (
        <FixedFooter>
            <form onSubmit={onSubmit} noValidate id="edit-question__form">
                <SectionNavigator>
                    <Section label="Question Details" isValid={!detailsError.general} errMsg={detailsError.general}>
                        <QuestionDetails
                            question={question}
                            fieldName={activeStudyField?.name || ""}
                            errors={detailsError}
                            onChange={onDetailsChange} />
                    </Section>
                    <Section label="Question answers" isValid={!answersError} errMsg={answersError}>
                        <QuestionAnswers question={question} onChange={onChange} />
                    </Section>
                </SectionNavigator>
            </form >
            <div>
                <AppButton disabled={isInvalid} type="submit" className="edit-question__form" form="edit-question__form">
                    {question.id ? "Edit" : "Create"}
                </AppButton>
                <AppButton disabled={isInvalid} type="button" varaiety="secondary" className="edit-question__form" onClick={() => previewQuestion()}>
                    Preview
                </AppButton>
            </div>
        </FixedFooter>
    )
}

export default EditQuestion
