import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { constants } from "@yahalom-tests/common";
import { AppButton, FormField } from "../../components";
import { useAuth } from "../../hooks/auth.hook";
import "./Login.scoped.scss";

const Login: React.FC = () => {
	const { replace, push } = useHistory(); //replace doesnt make any affect on user pages history
	const { state, pathname } = useLocation<any>();
	const isLogin = /login/i.test(pathname);
	const { signin, signup } = useAuth();
	const { from } = state || { from: { pathname: "/" } };
	const [tmpUser, setTmpUser] = useState({ email: "", password: "" });
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const isValid = Boolean(
		emailError || passwordError || !tmpUser.email || !tmpUser.password
	);
	useEffect(() => {
		const isValidEmail = constants.validations.emailRegex.test(
			tmpUser.email
		);
		setEmailError(isValidEmail ? "" : "Please enter a valid email");
	}, [tmpUser.email, setEmailError]);
	useEffect(() => {
		const isValidPassword = constants.validations.passwordRegex.test(
			tmpUser.password
		);
		setPasswordError(
			isValidPassword ? "" : constants.validations.passwordDescription
		);
	}, [tmpUser.password, setPasswordError]);
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const authMethod = isLogin ? signin : signup;
		if (await authMethod(tmpUser)) {
			replace(from);
		}
	};

	const onPageChangeRequest = () => {
		push(isLogin ? "/signup" : "/login", state);
	};

	return (
		<div className="login__dialog">
			<h1 className="login__dialog-title">
				{isLogin ? "Login" : "Sign up"}
			</h1>
			<form onSubmit={onSubmit}>
				<FormField
					label="Email"
					type="text"
					autoComplete="username"
					value={tmpUser.email}
					onChange={e =>
						setTmpUser({ ...tmpUser, email: e.target.value.trim() })
					}
					error={emailError}
				/>
				<FormField
					label="Password"
					type="password"
					autoComplete={isLogin ? "current-password" : "new-password"}
					value={tmpUser.password}
					onChange={e =>
						setTmpUser({
							...tmpUser,
							password: e.target.value.trim(),
						})
					}
					error={passwordError}
				/>
				<AppButton disabled={isValid} type="submit">
					Submit
				</AppButton>
			</form>

			<AppButton onClick={onPageChangeRequest} type="button">
				{isLogin
					? "Not registered? Signup!"
					: "Have an account? Login!"}
			</AppButton>
		</div>
	);
};

export default Login;
