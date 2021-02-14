import { models } from "@yahalom-tests/common";
import React, { useState, useContext, createContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { AuthRequest } from "../models";
import { authService } from "../services";

type providerFn = {
	jwt?: string; //json web token.
	activeStudyField?: ActiveItem;
	activeOrganization?: models.interfaces.OrganizationBaseInfo;
	organizationBaseInfo?: models.interfaces.OrganizationBaseInfo[];
	signin: (user: models.interfaces.User) => Promise<boolean>;
	signup: (user: models.interfaces.User) => Promise<boolean>;
	signout: () => void;
	getOrganizationAndFieldUrl: (...params: string[]) => string;
	setActiveStudyField: (val?: ActiveItem) => void;
	setActiveOrganization: (
		val?: models.interfaces.OrganizationBaseInfo
	) => void;
	buildAuthRequestData: () => AuthRequest
};
type ActiveItem = { name: string; id?: models.classes.guid };
//define defaults results for context
const authContext = createContext<providerFn>({
	buildAuthRequestData: () => ({ jwt: "", organizationId: "", studyFieldId: "" }),
	getOrganizationAndFieldUrl: () => "",
	setActiveOrganization: () => { },
	setActiveStudyField: () => { },
	signin: async () => false,
	signout: () => { },
	signup: async () => false,
	jwt: undefined,
	activeStudyField: undefined,
	activeOrganization: undefined,
	organizationBaseInfo: undefined,
});

export function ProvideAuth({ children }: React.PropsWithChildren<{}>) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

function useProvideAuth(): providerFn {
	const { replace } = useHistory();
	const [jwt, setJwt] = useState<string>();
	const [organizationBaseInfo, setOrganizationBaseInfo] = useState<
		models.interfaces.OrganizationBaseInfo[]
	>();
	const [activeStudyField, setActiveStudyField] = useState<ActiveItem>();
	const [activeOrganization, setActiveOrganization] = useState<
		models.interfaces.OrganizationBaseInfo
	>();

	const signin = async (user: models.interfaces.User) => {
		try {
			const { data } = await authService.login(user);
			setJwt(data.jwt);
			setOrganizationBaseInfo(data.organizationsInfo);
			localStorage.setItem('authData', JSON.stringify(data));
			return true;
		} catch (error) {
			return false;
		}
	};

	const signup = async (user: models.interfaces.User) => {
		try {
			await authService.signup(user);
			return true;
		} catch (error) {
			return false;
		}
	};

	const signout = () => {
		replace("/")
		localStorage.removeItem('authData');
		setJwt(undefined);
		setOrganizationBaseInfo(undefined);
	};

	const getOrganizationAndFieldUrl = useCallback((...params: string[]) => {
		return `/${activeOrganization?.id}/${activeStudyField?.id}/${params.join("/")}`;
	}, [activeOrganization, activeStudyField]);
	const buildAuthRequestData = useCallback(() => {
		return { jwt: jwt ?? "", organizationId: activeOrganization?.id ?? "", studyFieldId: activeStudyField?.id ?? "" }
	}, [jwt, activeOrganization, activeStudyField])
	useEffect(() => {
		const authData = localStorage.getItem('authData');
		const data = JSON.parse(authData || "{}");
		if (data && data.jwt && data.organizationsInfo) {
			setJwt(data.jwt);
			setOrganizationBaseInfo(data.organizationsInfo);
		}
	}, [setJwt, setOrganizationBaseInfo]);
	// Return the user object and auth methods
	return {
		jwt,
		signin,
		signup,
		signout,
		activeStudyField,
		setActiveStudyField,
		activeOrganization,
		setActiveOrganization,
		organizationBaseInfo,
		buildAuthRequestData,
		getOrganizationAndFieldUrl,
	};
}
