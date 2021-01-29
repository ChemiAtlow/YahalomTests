import { models } from '@yahalom-tests/common';
import React, { useEffect } from 'react';
import { match, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Container } from '../../components';
import { useLoading } from '../../hooks';
import { examService } from '../../services';
import ExamQuestions from './ExamQuestions';
import StudentForm from './StudentForm';

interface ExamProps {
    match: match<{ testId: models.classes.guid }>;
}

const Exam: React.FC<ExamProps> = ({ match }) => {
    const { testId } = match.params;
    const { path, url } = useRouteMatch();
    const { push } = useHistory();
    const { setLoadingState } = useLoading();

    useEffect(() => setLoadingState("loading"), [])

    const onRequestNewExam = async (student: models.dtos.StudentDto) => {
        console.log(student);
        setLoadingState("loading");
        try {
            const { data } = await examService.requestToStartExam(testId, student);
            console.log(data);
            setLoadingState("success");
            push(`${url}/${data.id}`, { exam: data });

        } catch (error) {
            console.log(error);
            setLoadingState("failure", "Couldn't currently start a new exam!");
        }
    }
    return (
        <Container>
            <Switch>
                <Route exact path={path}>
                    <StudentForm testId={match.params.testId} onRequestNewExam={onRequestNewExam} />
                </Route>
                <Route path={`${path}/:examId`} component={ExamQuestions} />
            </Switch>
        </Container>
    )
}

export default Exam;