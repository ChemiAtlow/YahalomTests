import { models } from "@yahalom-tests/common";
import React, { createElement, useEffect, useMemo } from "react";
import {
	Redirect,
	Route,
	RouteProps,
} from "react-router-dom";
import { useAuth } from "../../hooks/";

interface ProtectedRouteProps extends RouteProps {
	setsField?: boolean;
	requiresField?: boolean;
	onlyNonAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	component,
	children,
	setsField,
	requiresField,
	onlyNonAuth,
	...rest
}) => {
	const { jwt, organizationBaseInfo, setActiveOrganization, setActiveStudyField, activeOrganization, activeStudyField } = useAuth();
	const { organizationId, fieldId } = (rest as any)?.computedMatch?.params;
	useEffect(() => {
		//need to seperate if..
		if (setsField) {
			if (models.classes.Guid.isValid(organizationId || "") && models.classes.Guid.isValid(fieldId || "")) {
				const organizationWithRequestedId = organizationBaseInfo?.find(org => org.id === organizationId)
				if (organizationWithRequestedId) {  //user has permission to this organization
					setActiveOrganization(organizationWithRequestedId);
					const requestedStudyField = organizationWithRequestedId.fields.find(fld => fld.id === fieldId);
					if (requestedStudyField) { //field is from organization
						setActiveStudyField(requestedStudyField);
					} else {
						console.warn("Your organization doesn't have this study field!");
					}
				} else {
					console.warn("You are not permmited to reach requested organization!");
				}
			}
		}
	}, [setActiveOrganization, setActiveStudyField, organizationId, fieldId, setsField, organizationBaseInfo]);


	const isNonAuthAllowed = useMemo(() => onlyNonAuth && !jwt, [onlyNonAuth, jwt]);
	const isFieldAllowed = useMemo(() => requiresField ? (activeOrganization && activeStudyField) : true, [requiresField, activeOrganization, activeStudyField]);
	const isAuthAllowed = useMemo(() => !onlyNonAuth && Boolean(jwt) && isFieldAllowed, [onlyNonAuth, jwt, isFieldAllowed]);
	const isAllowed = useMemo(() => isNonAuthAllowed || isAuthAllowed, [isNonAuthAllowed, isAuthAllowed]);
	return (
		<Route
			{...rest}
			render={({ location }) =>
				isAllowed
					? (component ? createElement(component) : children)
					: <Redirect to={{ pathname: onlyNonAuth ? "/" : "/login", state: { from: location || "" } }} />
			}
		/>
	);
};

export default ProtectedRoute;
