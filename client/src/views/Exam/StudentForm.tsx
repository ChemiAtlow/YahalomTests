import { constants, models } from '@yahalom-tests/common';
import React, { useEffect, useMemo, useState } from 'react'
import { AppButton, FormField, Row } from '../../components';
import { useLoading } from '../../hooks';
import { examService } from '../../services';

interface StudentFormProps {
    onRequestNewExam: (student: models.dtos.StudentDto) => void;
    testId: models.classes.guid;
}

const StudentForm: React.FC<StudentFormProps> = ({ onRequestNewExam, testId }) => {
    const { setLoadingState } = useLoading();
    const [student, setStudent] = useState<models.dtos.StudentDto>({
        email: "",
        firstName: "",
        lastName: "",
        phone: ""
    });
    const [studentErrors, setStudentErrors] = useState<models.dtos.StudentDto>({
        email: "",
        firstName: "",
        lastName: "",
        phone: ""
    });
    const isValid = useMemo(() => {
        const isEmailValid = Boolean(student.email) && !studentErrors.email;
        const isFirstNameValid = Boolean(student.firstName) && !studentErrors.firstName;
        const isLastNameValid = Boolean(student.lastName) && !studentErrors.lastName;
        const isPhoneValid = Boolean(student.phone) && !studentErrors.phone;
        return isEmailValid && isFirstNameValid && isLastNameValid && isPhoneValid;
    }, [student, studentErrors])
    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const isValidEmail = constants.validations.emailRegex.test(value);
        setStudentErrors({ ...studentErrors, email: isValidEmail ? "" : "Please enter a valid email!" })
        setStudent({ ...student, email: value });
    }
    const onFnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const isValidName = /^[A-Z]+$/i.test(value);
        setStudentErrors({ ...studentErrors, firstName: isValidName ? "" : "Name must be english letters only!" })
        setStudent({ ...student, firstName: value });
    }
    const onLnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const isValidName = /^[A-Z]+$/i.test(value);
        setStudentErrors({ ...studentErrors, lastName: isValidName ? "" : "Name must be english letters only!" })
        setStudent({ ...student, lastName: value });
    }
    const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const isValidPhone = Boolean(value.trim());
        setStudentErrors({ ...studentErrors, phone: isValidPhone ? "" : "Please enter a valid ohone!" })
        setStudent({ ...student, phone: value });
    }
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            return;
        }
        onRequestNewExam(student);
    };

    useEffect(() => {
        // setLoadingState("loading");
        examService
            .checkIfTestIdIsValid(testId)
            .then(() => setLoadingState("success"))
            .catch(() => setLoadingState("failure", "There seems to be no test with the requested Id!"));
    }, [setLoadingState, testId])

    return (
        <form onSubmit={onSubmit}>
            <Row>
                <FormField
                    type="text"
                    value={student.email}
                    onChange={onEmailChange}
                    error={studentErrors.email}
                    label="Email" />
                <FormField
                    type="text"
                    value={student.firstName}
                    onChange={onFnameChange}
                    error={studentErrors.firstName}
                    label="First name" />
                <FormField
                    type="text"
                    value={student.lastName}
                    onChange={onLnameChange}
                    error={studentErrors.lastName}
                    label="Last name" />
                <FormField
                    type="text"
                    value={student.phone}
                    onChange={onPhoneChange}
                    error={studentErrors.phone}
                    label="Phone" />
            </Row>
            <AppButton type="submit" disabled={!isValid}>Start test!</AppButton>
        </form>
    )
}

export default StudentForm
