import { models } from '@yahalom-tests/common'
import React, { useState, useEffect } from 'react'
import { AppButton, FormField, Select } from '../../components/Forms'
import { useAuth } from "../../hooks";

interface EditParams {
    questionId?: models.classes.guid;
}
const types = (Object.values(models.enums.QuestionType) as number[])
    .filter(isNaN)
    .map(v => ({ label: v.toString() }));

const EditQuestion: React.FC = () => {
    const [question, setQuestion] = useState<models.dtos.QuestionDto>({
        title: "",
        additionalContent: "",
        type: models.enums.QuestionType.SingleChoice,
        answers: [],
        label: "",
        alignment: "Vertical",
    });
    const [titleError, setTitleError] = useState("");
    const [answersError, setAnswersError] = useState("");
    const [labelError, setLabelError] = useState("");

    const { activeStudyField } = useAuth()

    const isInvalid = Boolean(
        titleError || answersError || labelError ||
        question.answers.length < 2
    );

    // useEffect(() => {

    // }, [question])

    const onTypeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(question);
        setQuestion({ ...question, type: e.target.selectedIndex - 1 });
        console.log(question);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("save");
    };
 

    return (
        <form onSubmit={onSubmit}>
            <p>Field: <b>{activeStudyField?.name}</b></p>
            <Select label="Question type"
                value={question.type}
                onChange={onTypeSelected}
                options={types} />
            <FormField
                label="title"
                type="text"
                value={question.title}
                onChange={e =>
                    setQuestion({ ...question, title: e.target.value.trim() })
                }
                error={titleError}
            />

            <FormField
                label="aditional content"
                type="textarea"
                value={question.additionalContent}
                onChange={e =>
                    setQuestion({ ...question, additionalContent: e.target.value.trim() })
                }
                error={titleError}
            />
            {/* /*not render on UI. need to check*/}
            <div> Answers
              {
                    /**Will use answer component */
                }
            </div>

            <FormField
                label="label"
                type="text"
                value={question.label}
                onChange={e =>
                    setQuestion({ ...question, label: e.target.value.trim() })
                }
                error={labelError}
            />

            <AppButton disabled={isInvalid} type="submit">
                Submit
				</AppButton>
        </form >
    )
}

export default EditQuestion
