import { models } from "@yahalom-tests/common";
import React, { useState } from "react";
import { ModalInstance } from "../../hooks";
import ExamQuestions from "../ExamQuestions";
import { BaseModal } from "./BaseModal";

export interface ExamReviewModalProps extends ModalInstance<boolean> {
    examResult: models.interfaces.ExamResult;
    children?: never;
}

export const ExamReviewModal: React.FC<ExamReviewModalProps> = ({
    examResult,
    close
}) => {
    const [pageNumber, setPageNumber] = useState(0);
    const selectionState: () => [boolean[], (selections: boolean[]) => void] = () => {
        const selections = examResult.answeredQuestions?.[pageNumber].answers.map(({ correct }) => correct);
        return [selections || [], () => { }];
    };

    return (
        <BaseModal close={close} title={examResult.title} footer={""}>
            <ExamQuestions exam={examResult} changePage={setPageNumber} currentPage={pageNumber} selectionStateBuilder={selectionState} />
        </BaseModal>
    );
};
