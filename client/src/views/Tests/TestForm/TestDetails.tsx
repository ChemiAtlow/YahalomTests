import React from 'react';
import { models } from '@yahalom-tests/common';
import { Row, FormField, Select, Container, ToggleSwitch } from '../../../components';
import { useAuth } from "../../../hooks";
import { enumToArray, SwitchCamelCaseToHuman } from '../../../utils';

const languages = enumToArray(models.enums.Language).map(SwitchCamelCaseToHuman);
export type TestDetailsKeys = Pick<models.dtos.TestDto,
    "language" | "intro" | "minPassGrade" | "title" | "isReviewEnabled">;

interface TestDetailsProps {
    test: TestDetailsKeys;
    onChange: (change: Partial<TestDetailsKeys>) => void;
    titleError: string;
    gradeError: string;
    introError: string;
};

export const TestDetails: React.FC<TestDetailsProps> = ({ test, onChange, gradeError, introError, titleError }) => {
    const { activeStudyField } = useAuth();
    const genericChange = <K extends keyof TestDetailsKeys, V extends TestDetailsKeys[K]>(key: K, value: V) => {
        onChange({ [key]: value })
    }

    return (
        <Container>
            <p>Field: <b>{activeStudyField?.name}</b></p>
            <Row>
                <Select label="Test language"
                    required
                    value={test.language}
                    onChange={({ target }) => genericChange("language", target.selectedIndex - 1)}
                    options={languages} />
                <FormField label="Test title"
                    type="text"
                    required
                    value={test.title}
                    onChange={({ target }) => genericChange("title", target.value)}
                    error={titleError}
                />
                <FormField label="Passing grade"
                    type="number"
                    min={1}
                    max={99}
                    required
                    value={test.minPassGrade}
                    onChange={({ target }) => genericChange("minPassGrade", +target.value)}
                    error={gradeError}
                />
                <ToggleSwitch variety="large" checked={test.isReviewEnabled} onChange={({ target }) => genericChange("isReviewEnabled", target.checked)}>
                    Show correct answers after submission
                </ToggleSwitch>
                <FormField label="Test intro - Header"
                    type="textarea"
                    required
                    value={test.intro}
                    onChange={({ target }) => genericChange("intro", target.value)}
                    error={introError}
                />
            </Row>
        </Container>
    )
}

