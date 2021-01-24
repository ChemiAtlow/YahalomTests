import React, { useState } from 'react';
import { useAuth } from "../../../hooks";
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';

export const TestQuestions: React.FC<models.dtos.TestDto> = (testProp) => {
    const { activeStudyField, buildAuthRequestData } = useAuth();
    //set test prop as component state.
    const [test, setTest] = useState<models.dtos.TestDto>({ ...testProp });
    return (
        <div>
            TestQuestions
        </div>
    )
}