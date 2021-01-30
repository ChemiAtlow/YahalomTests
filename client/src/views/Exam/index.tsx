import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from '../../components';
import ExamQuestions from './ExamQuestions';
import StudentForm from './StudentForm';

const Exam: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <Container>
            <Switch>
                <Route exact path={path} component={StudentForm} />
                <Route path={`${path}/:examId`} component={ExamQuestions} />
            </Switch>
        </Container>
    )
}

export default Exam;