import { models } from "@yahalom-tests/common";
import React from "react";
import { FormField, Select, Row, Container } from "../../../components";
import { enumToArray, SwitchCamelCaseToHuman } from "../../../utils";
import type { QuestionDetailsKeys, QuestionDetailsErrors } from "./types";

const types = enumToArray(models.enums.QuestionType).map(SwitchCamelCaseToHuman);
const alignments = enumToArray(models.enums.Alignment).map(SwitchCamelCaseToHuman);

interface QuestionDetailsProps {
    fieldName: string;
    question: QuestionDetailsKeys;
    errors: Omit<QuestionDetailsErrors, "general">;
    onChange: (change: Partial<QuestionDetailsKeys>) => void;
}

export const QuestionDetails: React.FC<QuestionDetailsProps> = ({ fieldName, question, onChange, errors }) => {
    const genericChange = <K extends keyof QuestionDetailsKeys, V extends QuestionDetailsKeys[K]>(key: K, value: V) => {
        onChange({ [key]: value })
    }

    return (
        <Container>
            <p>
                Field: <b>{fieldName}</b>
            </p>
            <Row>
                <Select
                    label="Question type"
                    required
                    value={question.type}
                    onChange={({target}) => genericChange("type", target.selectedIndex - 1)}
                    options={types}
                />
                <Select
                    label="Answer layout"
                    required
                    value={question.alignment}
                    onChange={({target}) => genericChange("alignment", target.selectedIndex - 1)}
                    options={alignments}
                />
            </Row>
            <FormField
                label="Title"
                type="text"
                required
                value={question.title}
                onChange={({target}) => genericChange("title", target.value)}
                error={errors.title}
            />
            <FormField
                label="Aditional content"
                type="textarea"
                value={question.additionalContent}
                onChange={({target}) => genericChange("additionalContent", target.value)}
            />
            <FormField
                label="Tags"
                required
                type="text"
                value={question.label}
                onChange={({target}) => genericChange("label", target.value)}
                error={errors.label}
            />
        </Container>
    );
};
