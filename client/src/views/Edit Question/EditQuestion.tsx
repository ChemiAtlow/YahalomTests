import { useLocation, useParams } from "react-router-dom";
import { models } from '@yahalom-tests/common'
import React, { useState } from 'react'
import { AppButton, FormField } from '../../components/Forms'
import { QuestionType } from "@yahalom-tests/common/dist/models/enums";

//use location hook - get id from url
//use effect - will called once when location hook 
interface EditParams {
    questionId?: models.classes.guid;
}

const EditQuestion: React.FC = () => {
    const [question, SetQuestion] = useState<models.interfaces.Question>({ title: "", additionalContent: "", type: QuestionType.SingleChoice, answers: [], label: "", alignment: "Vertical", lastUpdate: -1 });
    const [titleError, setTitleError] = useState("");
    const [answersError, setAnswersError] = useState("");
    const [labelError, setLabelError] = useState("");
    const [alignmentError, setAlignmentError] = useState("");

    const isValid = Boolean(
        titleError || answersError || labelError ||
        alignmentError ||
        question.type || question.answers.length < 1
    );

    const [questionTypes, setQuestionTypes] = useState(models.enums.QuestionType);
    const onTypeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        SetQuestion({ ...question, type: QuestionType.SingleChoice });
    };

    const { state, pathname } = useLocation<any>();
    const { questionId } = useParams<EditParams>();
    const isActive = (questionId === undefined) ? true : false; //this need to be changed to searching question in server.

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("save");
    };


    return (
        <form onSubmit={onSubmit}>
            <FormField
                label="title"
                type="text"
                autoComplete={isActive ? "Edit title" : "Create title"}
                value={question.title}
                onChange={e =>
                    SetQuestion({ ...question, title: e.target.value.trim() })
                }
                error={titleError}
            />

            <FormField
                label="aditional content"
                type="textarea"
                autoComplete={isActive ? "Edit content" : "Create content"}
                value={question.additionalContent}
                onChange={e =>
                    SetQuestion({ ...question, additionalContent: e.target.value.trim() })
                }
                error={titleError}
            />
            <div>
                <select value={questionTypes.SingleChoice} onChange={onTypeSelected}>
                    {Object.keys(QuestionType).map((key, i) => {
                        (
                            <option key={key} value={key}>
                                {QuestionType[i]}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* /*not render on UI. need to check*/}
            <div> Answers
              {
                    Array(4).map((e, i) => {
                        (
                            <FormField
                                label={`${i} answer`}
                                type="textarea"
                                autoComplete={isActive ? "Edit answer" : "Create answer"}
                                value={question.answers[i]?.content}
                                onChange={e =>
                                    SetQuestion({ ...question, answers: [{ content: e.target.value, correct: false }] }) //need to complete correct setState
                                }
                                error={answersError}
                            />
                        )
                    })}
            </div>

            <FormField
                label="label"
                type="text"
                autoComplete={isActive ? "Edit label" : "Create label"}
                value={question.label}
                onChange={e =>
                    SetQuestion({ ...question, label: e.target.value.trim() })
                }
                error={labelError}
            />
            <FormField
                label="alignment"
                type="text"
                autoComplete={isActive ? "Edit alignment" : "Create alignment"}
                value={question.alignment}
                onChange={e =>
                    SetQuestion({ ...question, alignment: "Horizontal" !== e.target.value.trim() ? "Horizontal" : "Vertical" })
                }
                error={alignmentError}
            />
            <AppButton disabled={isValid} type="submit">
                Submit
				</AppButton>
        </form >
    )
}

export default EditQuestion
