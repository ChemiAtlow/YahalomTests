import { models } from "@yahalom-tests/common";
import React from "react";
import { ModalInstance } from "../../hooks";
import Question from "../Question";
import { BaseModal } from "./BaseModal";
import "./ErrorModal.scoped.scss";

interface ErrorModalProps extends ModalInstance {
    question: models.dtos.QuestionDto;
}

export const QuestionPeekModal: React.FC<ErrorModalProps> = ({ question, close }) => {
    return (
        <BaseModal close={close} okText="Close" title="Preview question">
            <Question question={question} />
        </BaseModal>
    );
};
