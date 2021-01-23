import React from "react";
import { ModalInstance } from "../../hooks";
import { BaseModal } from "./BaseModal";
import "./ErrorModal.scoped.scss";

interface ErrorModalProps extends ModalInstance {
    title: string;
    body: string;
}

const errorTitle = (title: string) => (
    <div className="error-modal__title">
        {/* ICON of error */}
        <span>{title}</span>
    </div>
);

export const ErrorModal: React.FC<ErrorModalProps> = ({ body, close, title }) => {
    return (
        <BaseModal close={close} cancelText="OK" title={errorTitle(title)}>
            {body}
        </BaseModal>
    );
};
