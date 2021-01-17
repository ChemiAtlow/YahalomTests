import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppButton, FormField } from "../../components/Forms";
import { useAuth } from "../../hooks/auth.hook";
import "./Login.scoped.scss";

const Login: React.FC = () => {
	const { replace, push } = useHistory(); //replace doesnt make any affect on user pages history
	const { state, pathname } = useLocation<any>();
	const isLogin = /login/i.test(pathname);
	const { signin, signup } = useAuth();
	const { from } = state || { from: { pathname: "/" } };
	const [tmpUser, setTmpUser] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({ email: "", password: "" });
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const authMethod = isLogin ? signin : signup;
		if (await authMethod(tmpUser)) {
			console.log(from, state);
			replace(from);
		}
	};

	const onPageChangeRequest = () => {
		push(isLogin ? "/signup" : "/login", state);
	};

	const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTmpUser({ ...tmpUser, email: e.target.value });
		const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(tmpUser.email);
		setErrors({ ...errors, email: isValidEmail ? "" : "Please enter a valid email" })
	};

	const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTmpUser({ ...tmpUser, password: e.target.value });
		const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#\$%\^&\*])(?=.{8,})/.test(tmpUser.password);
		setErrors({ ...errors, password: isValidPassword ? "" : "Password needs to have at least: 1 upper-case, 1 lower-case, 1 number, 1 special char and minimum 8 chars" });
	};

	/*  - define password regex to const in commen
		- define error messages in consts -=> common.

	*/

	return (
		<div className="login__dialog">
			<h1 className="login__dialog-title">{isLogin ? "Login" : "Sign up"}</h1>
			<form onSubmit={onSubmit}>
				<FormField
					label="Email"
					type="text"
					value={tmpUser.email}
					onChange={onEmailChanged}
					error={errors.email}
				/>
				<FormField
					label="Password"
					type="password"
					value={tmpUser.password}
					onChange={onPasswordChanged}
					error={errors.password}
				/>
				<AppButton disabled={Boolean((errors.email || errors.password) || (!tmpUser.email || !tmpUser.password))} type="submit">Submit</AppButton>
			</form>

			<AppButton onClick={onPageChangeRequest} type="button">{isLogin ? "Not registered? Signup!" : "Have an account? Login!"}</AppButton>
		</div>
	);
};

export default Login;
