import { models } from "@yahalom-tests/common";
import React, { useState, useContext, createContext } from "react";

type userFn = (user: models.interfaces.User) => models.interfaces.User;
type providerFn = {
	user: models.interfaces.User | undefined;
	signin: userFn;
	signup: userFn;
	signout: () => void;
	sendPasswordResetEmail: (email: string) => boolean;
	confirmPasswordReset: (code: string, password: string) => boolean;
};

const authContext = createContext<providerFn | undefined>(undefined);

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
	const signin: userFn = ({ email, password }) => {
		return { email, password };
	};

	const signup: userFn = ({ email, password }) => {
		return { email, password };
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
