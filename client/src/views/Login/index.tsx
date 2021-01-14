import { models } from "@yahalom-tests/common";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppButton, FormField } from "../../components/Forms";
import { useAuth } from "../../hooks/auth.hook";
import "./Login.scoped.scss";

const Login: React.FC = () => {
	let { replace } = useHistory();
	let { state } = useLocation<any>();
	const { signin } = useAuth();
	const { from } = state || { from: { pathname: "/" } };
	const [tmpUser, setTmpUser] = useState<models.interfaces.User>({
		email: "",
		password: "",
	});
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(tmpUser);
		if (signin(tmpUser)) {
			replace(from);
		}
	};
	return (
		<div className="login__dialog">
			<h1 className="login__dialog-title">Login</h1>
			<form onSubmit={onSubmit}>
				<FormField
					label="Email"
					type="text"
					value={tmpUser.email}
					onChange={e =>
						setTmpUser({ ...tmpUser, email: e.target.value })
					}
				/>
				<FormField
					label="Password"
					type="password"
					value={tmpUser.password}
					onChange={e =>
						setTmpUser({ ...tmpUser, password: e.target.value })
					}
				/>
				<AppButton type="submit">Submit</AppButton>
			</form>
		</div>
	);
};

export default Login;
