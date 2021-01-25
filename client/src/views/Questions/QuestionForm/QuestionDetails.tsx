import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { FormField, Select, Row } from "../../../components";
import { enumToArray, SwitchCamelCaseToHuman } from "../../../utils";

const types = enumToArray(models.enums.QuestionType).map(SwitchCamelCaseToHuman);
const alignments = enumToArray(models.enums.Alignment).map(SwitchCamelCaseToHuman);

export type QuestionDetailsKeys = Pick<
    models.interfaces.Question,
    "type" | "alignment" | "title" | "label" | "additionalContent"
>;
interface QuestionDetailsProps {
    fieldName: string;
    question: QuestionDetailsKeys;
    onChange: (change: Partial<QuestionDetailsKeys>) => void;
    onValidityChange: (change: string) => void;
}

export const QuestionDetails: React.FC<QuestionDetailsProps> = ({
    fieldName,
    question,
    onChange,
    onValidityChange
}) => {
    const [titleError, setTitleError] = useState("");
    const [labelError, setLabelError] = useState("");

    const onTypeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ type: e.target.selectedIndex - 1 });
    };
    const onAlignmentSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ alignment: e.target.selectedIndex - 1 });
    };

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleError("");
        const { value } = e.target;
        if (!value.trim()) {
            setTitleError("Title is required")
        }
        onChange({ title: value });
    };
    const onTagsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabelError("");
        const { value } = e.target;
        if (!value.trim()) {
            setLabelError("Label is required");
        } else if (!/(\w+)(,\s*\w+)*/.test(value)) {
            setLabelError("Label must be a comma seperated string")
        }
        onChange({ label: e.target.value });
    };
    useEffect(() => {
        let errorStr = "";
        if (titleError || labelError) {
            if (titleError && labelError) {
                errorStr = `Errors: ${titleError}, ${labelError}`
            } else {
                errorStr = `Error: ${titleError || labelError}`
            }
        }
        onValidityChange(errorStr)
    }, [titleError, labelError, onValidityChange])

    return (
        <div className="container">
            <p>
                Field: <b>{fieldName}</b>
            </p>
            <Row>
                <Select
                    label="Question type"
                    required
                    value={question.type}
                    onChange={onTypeSelected}
                    options={types}
                />
                <Select
                    label="Answer layout"
                    required
                    value={question.alignment}
                    onChange={onAlignmentSelected}
                    options={alignments}
                />
            </Row>
            <FormField
                label="Title"
                type="text"
                required
                value={question.title}
                onChange={onTitleChanged}
                error={titleError}
            />
            <FormField
                label="Aditional content"
                type="textarea"
                value={question.additionalContent}
                onChange={e => onChange({ additionalContent: e.target.value })}
            />
            <FormField
                label="Tags"
                required
                type="text"
                value={question.label}
                onChange={onTagsChanged}
                error={labelError}
            />
        </div>
    );
};
