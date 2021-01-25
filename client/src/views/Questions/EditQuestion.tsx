import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { AppButton, SectionNavigator, Section, ErrorModal, QuestionPeekModal } from '../../components';
import { QuestionDetails, QuestionDetailsKeys, QuestionAnswers } from './QuestionForm';
import { useAuth, useModal } from "../../hooks";
import { questionService } from '../../services';
import "./EditQuestion.scoped.scss";

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
    const [detailsError, setDetailsError] = useState("");
    const [answersError, setAnswersError] = useState("");
    const { activeStudyField, buildAuthRequestData } = useAuth();
    const { openModal } = useModal();
    const { state } = useLocation<{ question?: models.dtos.QuestionDto }>();
    const { params } = useRouteMatch<EditParams>();

    useEffect(() => {
        if (params.questionId && state?.question) {
            setQuestion(state.question);
        } else if (params.questionId && !state?.question) {
            questionService.getQuestion(buildAuthRequestData(), params.questionId)
                .then(({ data }) => setQuestion(data))
                .catch(err => openModal(ErrorModal, {
                    title: "Error loading question",
                    body: `An error occoured while loading the question for editing:\n${err?.message || ""}`
                }))
        }
    }, [state, params, setQuestion, buildAuthRequestData, openModal])
    const isInvalid = !question.title || !question.label || Boolean(detailsError) || question.answers.length < 2 || Boolean(answersError);
    const onChange = (e: Partial<QuestionDetailsKeys>) => setQuestion({ ...question, ...e });

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
        <form onSubmit={onSubmit} noValidate className="edit-question__form">
            <SectionNavigator>
                <Section label="Question Details" isValid={!detailsError} errMsg={detailsError}>
                    <QuestionDetails
                        question={question}
                        fieldName={activeStudyField?.name || ""}
                        onChange={onChange}
                        onValidityChange={setDetailsError} />
                </Section>
                <Section label="Question answers" isValid={!answersError} errMsg={answersError}>
                    <QuestionAnswers question={question} onChange={onChange} onValidityChange={setAnswersError} />
                </Section>
            </SectionNavigator>
            <div>
                <AppButton disabled={isInvalid} type="submit" className="edit-question__form">
                    {question.id ? "Edit" : "Create"}
                </AppButton>
                <AppButton disabled={isInvalid} type="button" varaiety="secondary" className="edit-question__form" onClick={() => previewQuestion()}>
                    Preview
                </AppButton>
            </div>
        </form >
    )
}

export default EditQuestion
