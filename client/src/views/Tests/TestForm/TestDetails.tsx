import React, { useState } from 'react';
import { models } from '@yahalom-tests/common';
import { Row, FormField, Select } from '../../../components';
import { useAuth } from "../../../hooks";
import { enumToArray, SwitchCamelCaseToHuman } from '../../../utils';

const languages = enumToArray(models.enums.Language).map(SwitchCamelCaseToHuman);


export const TestDetails: React.FC<models.dtos.TestDto> = (testProp) => {
    const { activeStudyField, buildAuthRequestData } = useAuth();
    //set test prop as component state.
    const [test, setTest] = useState<models.dtos.TestDto>({ ...testProp });

    const onLanguageSelected = (e: React.ChangeEvent<HTMLSelectElement>) => { };
    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onPassingGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onReviewedChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
    const onIntroChanged = (e: React.ChangeEvent<HTMLInputElement>) => { };
  
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
                    />
                    <FormField label="Passing grade"
                        type="number"
                        min={1}
                        max={99}
                        required
                        value={test.minPassGrade}
                        onChange={onPassingGradeChange}
                    />
                    <div>
                        <label>Show correct answers after submission</label>
                        <input type="checkbox" value="Review" onChange={onReviewedChanged} />
                    </div>
                    <FormField label="Test intro - Header"
                        type="textarea"
                        required
                        value={test.intro}
                        onChange={onIntroChanged}
                    />
                </Row>
            </div>
        </div>
    )
}

