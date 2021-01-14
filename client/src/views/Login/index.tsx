import React from "react";
import AppButton from "../../components/Forms/Button";
import FormField from "../../components/Forms/FormField";
import "./Login.scoped.scss";

const Login: React.FC = () => {
	return (
		<div className="login__dialog">
			<h1 className="login__dialog-title">Login</h1>
			<form onSubmit={e => e.preventDefault()}>
				<FormField label="Email" type="text" />
				<FormField label="Password" type="password" />
				<AppButton type="submit">Submit</AppButton>
			</form>
		</div>
	);
};

export default Login;
