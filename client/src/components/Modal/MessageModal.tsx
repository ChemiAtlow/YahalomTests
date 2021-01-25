import React from "react";
import { ModalInstance } from "../../hooks";
import { AppButton } from "../Forms";
import { BaseModal } from "./BaseModal";
import "./ErrorModal.scoped.scss";

export interface MessageModalProps extends ModalInstance<boolean> {
    title?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    children: React.ReactNode;
}

export const MessageModal: React.FC<MessageModalProps> = ({
    children,
    close,
    title,
    cancelText,
    okText,
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
                <AppButton varaiety="secondary" onClick={() => close(false)}>
                    {cancelText}
                </AppButton>
            )}
        </>
    );
    return (
        <BaseModal close={close} title={title} footer={footer}>
            {children}
        </BaseModal>
    );
};
