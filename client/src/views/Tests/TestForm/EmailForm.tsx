import React, { useEffect, useState } from 'react';
import { models } from '@yahalom-tests/common';
import { FormField } from '../../../components';

interface EmailFormProps {
    email: models.dtos.EmailDto;
    onChange: (change: Partial<models.dtos.EmailDto>) => void;
    onValidityChange: (change: string) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ email, onChange, onValidityChange }) => {
    const [subjectError, setSubjectError] = useState("");
    const [bodyError, setBodyError] = useState("");

    useEffect(() => {
        let errorStr = "";
        if (subjectError || bodyError) {
            if (subjectError && bodyError) {
                errorStr = `Errors: ${subjectError}, ${bodyError}`;
            } else {
                errorStr = `Error: ${subjectError || bodyError}`;
            }
        }
        onValidityChange(errorStr);
    }, [subjectError, bodyError, onValidityChange]);

    const stringPropsErrorValidate = (value: string, propName: string) => {
        propName === "subject" ? setSubjectError("") : setBodyError("");
        if (!value.trim()) {
            propName === "subject" ? setSubjectError(`${propName} is required!`) : setBodyError(`${propName} is required!`);
        }
    };

    const onSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, "subject");
        onChange({ subject: value });
    };
    const onBodyChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        stringPropsErrorValidate(value, "body");
        onChange({ body: value });
    };

    return (
        <>
            <FormField label="Mail subject"
                type="text"
                required
                value={email?.subject}
                onChange={onSubjectChange}
                error={subjectError}
            />
            <FormField label="Mail body"
                type="textarea"
                required
                value={email?.body}
                onChange={onBodyChanged}
                error={bodyError}
            />
        </>
    )
}
