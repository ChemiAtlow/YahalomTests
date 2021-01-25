import { models } from "@yahalom-tests/common";
import React from "react";
import { ModalInstance } from "../../hooks";
import Question from "../Question";
import { MessageModal } from "./MessageModal";

interface QuestionPeekModalProps extends ModalInstance {
    question: models.dtos.QuestionDto;
}

export const QuestionPeekModal: React.FC<QuestionPeekModalProps> = ({ question, close }) => {
    return (
        <MessageModal close={close} okText="Close" title="Preview question">
            <Question question={question} />
        </MessageModal>
    );
};
