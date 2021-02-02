import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { constants } from "@yahalom-tests/common";
import { AppButton, Container, ErrorModal, FormField, MessageModal } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import "./Login.scoped.scss";
const { emailRegex, passwordDescription, passwordRegex } = constants.validations;

const Login: React.FC = () => {
	const { replace, push } = useHistory(); //replace doesnt make any affect on user pages history
	const { state, pathname } = useLocation<any>();
	const isLogin = /login/i.test(pathname);
	const { signin, signup, organizationBaseInfo } = useAuth();
	const { openModal } = useModal();
	const { setLoadingState } = useLoading();
	const [tmpUser, setTmpUser] = useState({ email: "", password: "" });
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const isInvalid = Boolean(
		emailError || passwordError || !tmpUser.email || !tmpUser.password
	);
	useEffect(() => {
		if (organizationBaseInfo) {
			setLoadingState("success");
			replace(state?.from?.pathname || "/");
		}
	}, [organizationBaseInfo, state, replace]);
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoadingState("loading");
		if (isLogin && !await signin(tmpUser)) {
			setLoadingState("success");
			openModal(ErrorModal, { title: "Login has failed!", body: "Please check your credentials and try again." });
		}
		else if (!isLogin) {
			if (await signup(tmpUser)) {
				setLoadingState("success");
				// display success message
				openModal(MessageModal, { children: <p>Signup completed successfully.<br />A validation email was sent.</p>, title: "Success!", okText: "OK" })
				push("/login")
			}
			else {
				setLoadingState("success");
				openModal(ErrorModal, { title: "Signup has failed!", body: "Please try again." })
			}
		}
	};
	const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setEmailError(emailRegex.test(value) ? "" : "Please enter a valid email")
		setTmpUser({ ...tmpUser, email: value });
	}
	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setPasswordError(passwordRegex.test(value) ? "" : passwordDescription)
		setTmpUser({ ...tmpUser, password: value });
	}

	const onPageChangeRequest = () => {
		push(isLogin ? "/signup" : "/login", state);
	};
	const onForgotPassword = () => {
		push("/reset");
	};

	return (
		<Container>
			<div className="login__dialog">
				<h1 className="login__dialog-title">{isLogin ? "Login" : "Sign up"}</h1>
				<form onSubmit={onSubmit}>
					<FormField
						label="Email"
						type="text"
						autoComplete="username"
						value={tmpUser.email}
						onChange={onEmailChange}
						error={emailError}
					/>
					<FormField
						label="Password"
						type="password"
						autoComplete={isLogin ? "current-password" : "new-password"}
						value={tmpUser.password}
						onChange={onPasswordChange}
						error={passwordError}
					/>
					<AppButton disabled={isInvalid} type="submit">
						Submit
					</AppButton>
				</form>

				<AppButton onClick={onPageChangeRequest} type="button" varaiety="secondary">
					{isLogin ? "Not registered? Signup!" : "Have an account? Login!"}
				</AppButton>
				<AppButton onClick={onForgotPassword} type="button" varaiety="secondary">
					Forgot your password?
				</AppButton>
				</div>
			</Container>
	);
};

export default Login;
