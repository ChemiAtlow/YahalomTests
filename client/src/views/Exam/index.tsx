import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ExamProgress from './ExamProgress';
import StudentForm from './StudentForm';

const Exam: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path} component={StudentForm} />
            <Route path={`${path}/:examId/:page?`} component={ExamProgress} />
        </Switch>
    )
}

export default Exam;