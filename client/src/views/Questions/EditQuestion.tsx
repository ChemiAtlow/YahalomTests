import { models } from '@yahalom-tests/common';
import React, { useState, useEffect } from 'react';
import { Row, AppButton, FormField, Select, QuestionAnswer, SectionNavigator, Section, ErrorModal } from '../../components';
import { useAuth, useModal } from "../../hooks";
import { questionService } from '../../services';
import { enumToArray, SwitchCamelCaseToHuman } from '../../utils';

// interface EditParams {
//     questionId?: models.classes.guid;
// }
const types = enumToArray(models.enums.QuestionType).map(SwitchCamelCaseToHuman);
const alignments = enumToArray(models.enums.Alignment).map(SwitchCamelCaseToHuman);

const EditQuestion: React.FC = () => {
    const [question, setQuestion] = useState<models.dtos.QuestionDto>({
        title: "",
        additionalContent: "",
        type: models.enums.QuestionType.SingleChoice,
        answers: [{ content: "", correct: false }],
        label: "",
        alignment: models.enums.Alignment.Vertical,
    });
    const [titleError, setTitleError] = useState("");
    const [additionalContentError, setAdditionalContentError] = useState("");
    const [labelError, setLabelError] = useState("");
    const { activeStudyField, buildAuthRequestData } = useAuth();
    const { openModal } = useModal();

    const isInvalid = Boolean(
        titleError || additionalContentError || labelError ||
        question.answers.length < 2
    );
    useEffect(() => {
        question.title ? setTitleError("") : setTitleError("Question must have title!");
    }, [question.title, setTitleError]);
    useEffect(() => {
        question.label ? setLabelError("") : setLabelError("Question must have label!");
    }, [question.label, setLabelError]);
    useEffect(() => {
        question.additionalContent ? setAdditionalContentError("") : setAdditionalContentError("Question must have additional content!");
    }, [question.additionalContent, setAdditionalContentError]);

    const onTypeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestion({ ...question, type: e.target.selectedIndex - 1 });
    };
    const onAlignmentSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestion({ ...question, alignment: e.target.selectedIndex - 1 });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const questionClone = { ...question };
            const { answers } = questionClone;
            if (!answers[answers.length - 1]?.content.trim()) {
                answers.pop();
            }
            await questionService.addQuestion(buildAuthRequestData(), questionClone);
        } catch (err) {
            openModal(ErrorModal, { title: "Add question failed", body: err.message });
        }
    };

    const onSelectionChanged = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        //check if question is singlechoice
        if (question.type === models.enums.QuestionType.SingleChoice) {
            question.answers.forEach((answer, i) => {
                answer.correct = index === i;
            })
        }
        else {
            question.answers[index].correct = e.target.checked;
        }
        setQuestion({ ...question });
    };
    //needs to add new answer to existing question
    const onContentChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { answers } = question;
        const { value } = e.target;
        answers[index].content = value;
        //check automatocaly add new answer
        if (answers.length < 10 && index === answers.length - 1 && value) {
            answers.push({ content: "", correct: false });
        } else if (index === answers.length - 2 && !value && !answers?.[index + 1]?.content) {
            answers.pop();
        }
        setQuestion({ ...question });
    };

    return (
        <form onSubmit={onSubmit} noValidate>
            <SectionNavigator>
                <Section label="Question Details">
                    <div className="container">
                        <p>Field: <b>{activeStudyField?.name}</b></p>
                        <Row>
                            <Select label="Question type"
                                required
                                value={question.type}
                                onChange={onTypeSelected}
                                options={types} />
                            <Select label="Answer layout"
                                required
                                value={question.alignment}
                                onChange={onAlignmentSelected}
                                options={alignments} />
                        </Row>
                        <FormField
                            label="Title"
                            type="text"
                            required
                            value={question.title}
                            onChange={e =>
                                setQuestion({ ...question, title: e.target.value.trim() })
                            }
                            error={titleError}
                        />
                        <FormField
                            label="Aditional content"
                            type="textarea"
                            value={question.additionalContent}
                            onChange={e =>
                                setQuestion({ ...question, additionalContent: e.target.value })
                            }
                            error={additionalContentError}
                        />
                        <FormField
                            label="Tags"
                            required
                            type="text"
                            value={question.label}
                            onChange={e =>
                                setQuestion({ ...question, label: e.target.value.trim() })
                            }
                            error={labelError}
                        />
                    </div>
                </Section>
                <Section label="Question answers">
                    <div className="container">
                        {question.answers.map(({ content, correct }, i) =>
                            <QuestionAnswer
                                key={i}
                                questionType={question.type}
                                content={content}
                                answerIndex={i}
                                mode={{ isEditMode: true, onContentChange: e => onContentChange(e, i) }}
                                selected={correct}
                                onSelectionChange={e => onSelectionChanged(e, i)}
                            />
                        )}
                    </div>
                </Section>
            </SectionNavigator>
            <AppButton disabled={isInvalid} type="submit">
                Submit
            </AppButton>
        </form >
    )
}

export default EditQuestion
