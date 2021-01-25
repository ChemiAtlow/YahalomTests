import React from "react";
import { ModalInstance } from "../../hooks";
import Icon from "../Icon";
import { BaseModal } from "./BaseModal";
import "./ErrorModal.scoped.scss";

interface ErrorModalProps extends ModalInstance {
    title: string;
    body: string;
}

const errorTitle = (title: string) => (
    <div className="error-modal__title">
        <div className="error-modal__title-icon">
            <Icon icon="error" color="#ac0f1d" size={25} />
        </div>
        <span>{title}</span>
    </div>
);

export const ErrorModal: React.FC<ErrorModalProps> = ({ body, close, title }) => {
    return (
        <BaseModal close={close} okText="OK" title={errorTitle(title)}>
            {body}
        </BaseModal>
    );
};
