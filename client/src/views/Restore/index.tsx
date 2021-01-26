import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { constants } from "@yahalom-tests/common";
import { AppButton, ErrorModal, FormField, MessageModal } from "../../components";
import { useModal } from "../../hooks";
import "./Restore.scoped.scss";
import { authService } from "../../services";
const { emailRegex, passwordDescription, passwordRegex } = constants.validations;

const Restore: React.FC = () => {
    const { push } = useHistory(); //replace doesnt make any affect on user pages history
    const { params } = useRouteMatch<{ token?: string }>();
    const { openModal } = useModal();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const isInvalid = Boolean(error || !value);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (params.token) {
            try {
                await authService.resetPassword(params.token, { password: value });
                openModal(MessageModal, {
                    title: "Success!",
                    children: <p>Password was updated!</p>,
                    okText: "OK",
                });
            } catch (err) {
                openModal(ErrorModal, {
                    title: "Failure!",
                    body: "Please try again.",
                });
            }
        } else {
            try {
                await authService.sendResetPasswordEmail({ email: value });
                openModal(MessageModal, {
                    title: "Success!",
                    children: <p>A reset password email was sent to you.</p>,
                    okText: "OK",
                });
            } catch (err) {
                openModal(ErrorModal, {
                    title: "Failure!",
                    body: "Please check the email address and try again.",
                });
            }
        }
    };
    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (params.token) {
            setError(passwordRegex.test(value) ? "" : passwordDescription);
        } else {
            setError(emailRegex.test(value) ? "" : "Please enter a valid email");
        }
        setValue(value);
    };

    const onPageChangeRequest = () => {
        push("/login");
    };

    return (
        <div className="reset__dialog container">
            <h1 className="reset__dialog-title">
                {params.token ? "Reset password" : "Forgot password"}
            </h1>
            <form onSubmit={onSubmit}>
                <FormField
                    label={params.token ? "New Password" : "Email"}
                    type={params.token ? "password" : "text"}
                    autoComplete="username"
                    value={value}
                    onChange={onValueChange}
                    error={error}
                />
                <AppButton disabled={isInvalid} type="submit">
                    Submit
                </AppButton>
            </form>

            <AppButton onClick={onPageChangeRequest} type="button" varaiety="secondary">
                Return To Login
            </AppButton>
        </div>
    );
};

export default Restore;
