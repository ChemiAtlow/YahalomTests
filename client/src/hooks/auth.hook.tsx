import { models } from "@yahalom-tests/common";
import React, { useState, useContext, createContext } from "react";
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
	sendPasswordResetEmail: (email: string) => boolean;
	confirmPasswordReset: (code: string, password: string) => boolean;
};
type ActiveItem = { name: string; id?: models.classes.guid };
//define defaults results for context
const authContext = createContext<providerFn>({
	getOrganizationAndFieldUrl: () => "",
	setActiveOrganization: () => { },
	setActiveStudyField: () => { },
	confirmPasswordReset: () => false,
	sendPasswordResetEmail: () => false,
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
			return true;
		} catch (error) {
			return false;
		}
	};

	const signup = async (user: models.interfaces.User) => {
		//DO async signup
		try {
			await authService.signup(user);
			//TODO: let user know he was signed up.
			return true;
		} catch (error) {
			return false;
		}
	};

	const signout = () => {
		setJwt(undefined);
	};

	const sendPasswordResetEmail = (email: string) => {
		return true;
	};

	const confirmPasswordReset = (code: string, password: string) => {
		return true;
	};

	const getOrganizationAndFieldUrl = (...params: string[]) => {
		return `/${activeOrganization?.id}/${activeStudyField?.id}/${params.join("/")}`;
	};
	// useEffect(() => {
	// 	const unsubscribe = firebase.auth().onAuthStateChanged(user => {
	// 		if (user) {
	// 			setUser(user);
	// 		} else {
	// 			setUser(undefined);
	// 		}
	// 	});
	// 	// Cleanup subscription on unmount
	// 	return () => unsubscribe();
	// }, []);
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
		sendPasswordResetEmail,
		confirmPasswordReset,
		getOrganizationAndFieldUrl,
	};
}
