import { models } from '@yahalom-tests/common';
import React, { useEffect, useState } from 'react';
import { match, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Container, Loader } from '../../components';
import { examService } from '../../services';
import ExamQuestions from './ExamQuestions';
import StudentForm from './StudentForm';

export type PageState = "pending" | "success" | "failure";

interface ExamProps {
    match: match<{ testId: models.classes.guid }>;
}

const Exam: React.FC<ExamProps> = ({ match }) => {
    const { testId } = match.params;
    const { path, url } = useRouteMatch();
    const { push } = useHistory();

    const [state, setState] = useState<"pending" | "success" | "failure">("pending");
    //const [exam,setExam] = useState<models.interfaces.Exam>();
    useEffect(() => {
        examService.checkIfTestIdIsValid(testId)
            .then(() => setState("success"))
            .catch(() => setState("failure"));
    }, [testId])

    const onRequestNewExam = async (student: models.dtos.StudentDto) => {
        console.log(student);
        setState("pending");
        try {
            const { data } = await examService.requestToStartExam(testId, student);
            console.log(data);
            setState("success");
            push(`${url}/${data.id}`, { exam: data });

        } catch (error) {
            console.log(error);
            setState("failure");
        }
    }
    if (state === "pending") {
        return <Loader />
    } else if (state === "failure") {
        return <p>Error</p>
    }
    return (
        <Container>
            <Switch>
                <Route path={`${path}/:examId`} component={ExamQuestions} />
                <Route exact path={path}>
                    <StudentForm onRequestNewExam={onRequestNewExam} />
                </Route>
            </Switch>
        </Container>
    )
}

export default Exam;