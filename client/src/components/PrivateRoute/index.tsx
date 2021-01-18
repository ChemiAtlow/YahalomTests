import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../../hooks/";

interface PrivateRouteProps extends RouteProps {
	reuqiresField?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	children,
	reuqiresField,
	...rest
}) => {
	const { jwt, studyFieldId } = useAuth();
	const isAuth = Boolean(jwt) && reuqiresField ? Boolean(studyFieldId) : true;
	return (
		<Route
			{...rest}
			render={({ location }) =>
				isAuth ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;
