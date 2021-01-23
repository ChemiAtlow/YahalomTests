import React, { cloneElement } from 'react';
import { RouteProps, Switch, useRouteMatch } from 'react-router-dom';

interface NestedRoutesProp {
    children: React.ReactElement<RouteProps>[];
}

const NestedRoutes: React.FC<NestedRoutesProp> = ({ children }) => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            {children.map((c, i) =>
                cloneElement(c, { path: `${path}${c.props.path}`, key: i })
            )}
        </Switch>
    )
}

export default NestedRoutes;
