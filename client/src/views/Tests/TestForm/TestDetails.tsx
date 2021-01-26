import React, { useState, useEffect } from 'react';
import { models } from '@yahalom-tests/common';
import { Row, FormField, Select } from '../../../components';
import { useAuth } from "../../../hooks";
import { enumToArray, SwitchCamelCaseToHuman } from '../../../utils';

const languages = enumToArray(models.enums.Language).map(SwitchCamelCaseToHuman);
export type TestDetailsKeys = Pick<models.dtos.TestDto,
    "language" | "intro" | "minPassGrade" | "title" | "isReviewEnabled">;

interface TestDetailsProps {
    test: TestDetailsKeys;
    onChange: (change: Partial<TestDetailsKeys>) => void;
    onValidityChange: (change: string) => void;
};

export const TestDetails: React.FC<TestDetailsProps> = ({ test, onValidityChange, onChange }) => {
    const { activeStudyField } = useAuth();
    const [titleError, setTitleError] = useState("");
    const [gradeError, setGradeError] = useState("");
    const [introError, setIntroError] = useState("");

    useEffect(() => {
        let errorStr = "";
        const errors = [titleError, introError, gradeError];
        if (titleError || introError || gradeError) {
            if (titleError && introError && gradeError) {
                errorStr = `Errors: ${titleError}, ${introError},${gradeError}`;
            } else {
                errorStr = `Errors: `;
                errors.forEach(err => {
                    if (err) { errorStr += `${err},`; }
                });
                errorStr.slice(0, -1);
            }
        }
        onValidityChange(errorStr);
    }, [titleError, introError,gradeError, onValidityChange]);

    const onLanguageSelected = (e: React.ChangeEvent<HTMLSelectElement>) => { onChange({ language: e.target.selectedIndex - 1 }); };

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, "title");
        onChange({ title: value });
    };

    const onPassingGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGradeError("");
        const grade = +e.target.value;
        //check if grade isnt between 1-99
        if (!(grade > 1) || !(grade < 99)) {
            setGradeError("Passing grade must be between 1-99 ");
        }
        onChange({ minPassGrade: e.target.value as unknown as number });
    };
    const onReviewedChanged = (e: React.ChangeEvent<HTMLInputElement>) => { onChange({ isReviewEnabled: e.target.checked }) };

    const onIntroChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, "intro");
        onChange({ intro: e.target.value });
    };

    const stringPropsErrorValidate = (value: string, propName: string) => {
        propName === "Intro" ? setIntroError("") : setTitleError("");
        if (!value.trim()) {
            propName === "intro" ? setIntroError(`${propName} is required!`) : setTitleError(`${propName} is required!`);
        }
    };

    return (
        <div>
            <div className="container">
                <p>Field: <b>{activeStudyField?.name}</b></p>
                <Row>
                    <Select label="Test language"
                        required
                        value={test.language}
                        onChange={onLanguageSelected}
                        options={languages} />
                    <FormField label="Test title"
                        type="text"
                        required
                        value={test.title}
                        onChange={onTitleChanged}
                        error={titleError}
                    />
                    <FormField label="Passing grade"
                        type="number"
                        min={1}
                        max={99}
                        required
                        value={test.minPassGrade}
                        onChange={onPassingGradeChange}
                        error={gradeError}
                    />
                    <div>
                        <label>Show correct answers after submission</label>
                        <input type="checkbox" onChange={onReviewedChanged} />
                    </div>
                    <FormField label="Test intro - Header"
                        type="textarea"
                        required
                        value={test.intro}
                        onChange={onIntroChanged}
                        error={introError}
                    />
                </Row>
            </div>
        </div>
    )
}

