import React from "react";
import {
	Redirect,
	Route,
	RouteComponentProps,
	RouteProps,
} from "react-router-dom";
import { useAuth } from "../../hooks/";

interface ProtectedRouteProps extends RouteProps {
	reuqiresField?: boolean;
	onlyNonAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	reuqiresField: requiresField,
	onlyNonAuth,
	...rest
}) => {
	const { jwt, studyFieldId } = useAuth();
	const isNonAuthAllowed = onlyNonAuth && !jwt;
	const isAuthAllowed =
		!onlyNonAuth &&
		Boolean(jwt) &&
		(requiresField ? Boolean(studyFieldId) : true);
	const redirection = ({ location }: RouteComponentProps) =>
		onlyNonAuth ? (
			<Redirect to={{ pathname: "/" }} />
		) : (
			<Redirect to={{ pathname: "/login", state: { from: location } }} />
		);
	return (
		<Route
			{...rest}
			render={route =>
				isNonAuthAllowed || isAuthAllowed
					? children
					: redirection(route)
			}
		/>
	);
};

export default ProtectedRoute;
