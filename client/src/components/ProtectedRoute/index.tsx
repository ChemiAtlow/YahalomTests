import { models } from "@yahalom-tests/common";
import React, { useEffect, useRef } from "react";
import {
	Redirect,
	Route,
	RouteComponentProps,
	RouteProps,
	useParams,
} from "react-router-dom";
import { useAuth } from "../../hooks/";

interface ProtectedRouteProps extends RouteProps {
	requiresField?: boolean;
	onlyNonAuth?: boolean;
}
interface ProtectedRouteParamsProps {
	organizationId: string;
	fieldId: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiresField,
	onlyNonAuth,
	...rest
}) => {
	const { jwt, organizationBaseInfo, setActiveOrganization, setActiveStudyField } = useAuth();
	const { organizationId, fieldId } = useParams<ProtectedRouteParamsProps>();
	const isFieldAllowed = useRef(true);

	useEffect(() => {
		//need to seperate if..
		if (requiresField) {
			if (models.classes.Guid.isValid(organizationId || "") && models.classes.Guid.isValid(fieldId || "")) {
				const organizationWithRequestedId = organizationBaseInfo?.find(org => org.id === organizationId)
				if (organizationWithRequestedId) {  //user has permission to this organization
					setActiveOrganization(organizationWithRequestedId);
					const requestedStudyField = organizationWithRequestedId.fields.find(fld => fld.id === fieldId);
					if (requestedStudyField) { //field is from organization
						setActiveStudyField(requestedStudyField);
					} else {
						console.warn("Your organization doesn't have this study field!");
						isFieldAllowed.current = false;
					}
				} else {
					console.warn("You are not permmited to reach requested organization!");
					isFieldAllowed.current = false;
				}
			}
			else {
				isFieldAllowed.current = false;
			}
		}
	}, [setActiveOrganization, setActiveStudyField, organizationId, fieldId, requiresField, organizationBaseInfo]);


	const isNonAuthAllowed = onlyNonAuth && !jwt;
	const isAuthAllowed = !onlyNonAuth && Boolean(jwt) && isFieldAllowed;

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
