import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../hooks/auth.hook";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
	const { jwt } = useAuth();
	return (
		<Route
			{...rest}
			render={({ location }) =>
				jwt ? (
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
