import React from "react";
import { ModalInstance } from "../../hooks";
import { AppButton } from "../Forms";
import { BaseModal } from "./BaseModal";
import "./ErrorModal.scoped.scss";

interface ErrorModalProps extends ModalInstance {
    title: string;
    body: string;
    okText?: string;
    cancelText?: string;
}

export const WarningModal: React.FC<ErrorModalProps> = ({
    body,
    close,
    title,
    okText,
    cancelText,
}) => {
    const footer = (
        <>
            {okText && (
                <AppButton
                    onClick={() => {
                        close(true);
                    }}>
                    {okText}
                </AppButton>
            )}
            {cancelText && (
                <AppButton varaiety="secondary" color="error" onClick={() => close(false)}>
                    {cancelText}
                </AppButton>
            )}
        </>
    );
    return (
        <BaseModal close={close} title={title} footer={footer}>
            {body}
        </BaseModal>
    );
};
