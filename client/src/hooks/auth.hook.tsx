import { models } from "@yahalom-tests/common";
import React, { useState, useContext, createContext } from "react";
import { authService } from "../services";

type providerFn = {
	jwt?: string; //json web token.
	signin: (user: models.interfaces.User) => Promise<boolean>;
	signup: (user: models.interfaces.User) => Promise<boolean>;
	signout: () => void;
	sendPasswordResetEmail: (email: string) => boolean;
	confirmPasswordReset: (code: string, password: string) => boolean;
};
//define defaults results for context
const authContext = createContext<providerFn>({
	confirmPasswordReset: () => false,
	sendPasswordResetEmail: () => false,
	signin: async () => false,
	signout: () => {},
	signup: async () => false,
	jwt: undefined,
});

export function ProvideAuth({ children }: React.PropsWithChildren<{}>) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

function useProvideAuth() {
	const [jwt, setJwt] = useState<string>();

	const signin = async (user: models.interfaces.User) => {
		try {
			const { data } = await authService.login(user);
			setJwt(data);
			return true;
		} catch (error) {
			return false;
		}
	};

	const signup = async (user: models.interfaces.User) => {
		//DO async signup
		try {
			const { data } = await authService.signup(user);
			setJwt(data);
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
		sendPasswordResetEmail,
		confirmPasswordReset,
	};
}
