import { models } from "@yahalom-tests/common";
import React, { useState, useContext, createContext } from "react";

type userFn = (user: models.interfaces.User) => models.interfaces.User | null;
type providerFn = {
	user: models.interfaces.User | undefined;
	signin: userFn;
	signup: userFn;
	signout: () => void;
	sendPasswordResetEmail: (email: string) => boolean;
	confirmPasswordReset: (code: string, password: string) => boolean;
};

const authContext = createContext<providerFn>({
	confirmPasswordReset: () => false,
	sendPasswordResetEmail: () => false,
	signin: () => null,
	signout: () => {},
	signup: () => null,
	user: undefined,
});

export function ProvideAuth({ children }: React.PropsWithChildren<{}>) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

function useProvideAuth() {
	const [user, setUser] = useState<models.interfaces.User>();

	// Wrap any Firebase methods we want to use making sure ...
	// ... to save the user to state.
	const signin: userFn = user => {
		//DO async login
		setUser(user);
		return user;
	};

	const signup: userFn = user => {
		//DO async signup
		setUser(user);
		return user;
	};

	const signout = () => {
		setUser(undefined);
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
		user,
		signin,
		signup,
		signout,
		sendPasswordResetEmail,
		confirmPasswordReset,
	};
}
