import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ExamQuestions from './ExamQuestions';
import StudentForm from './StudentForm';

const Exam: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path} component={StudentForm} />
            <Route path={`${path}/:examId/:page?`} component={ExamQuestions} />
        </Switch>
    )
}

export default Exam;