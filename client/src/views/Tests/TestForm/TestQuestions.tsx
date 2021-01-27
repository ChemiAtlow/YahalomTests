import React, { useState, useEffect } from 'react';
import { useAuth, useModal } from "../../../hooks";
import { models } from '@yahalom-tests/common';
import { Column, DataTable, Ellipsis, Icon, QuestionPeekModal } from '../../../components';
import { questionService } from '../../../services';

export type TestQuestionsKeys = Pick<models.dtos.TestDto, "questions">;
interface TestQuestionsProps {
    test: TestQuestionsKeys;
    onChange: (change: Partial<TestQuestionsKeys>) => void;
    onValidityChange: (change: string) => void;
}

export const TestQuestions: React.FC<TestQuestionsProps> = ({ test, onChange, onValidityChange }) => {
    //set test prop as component state.
    const { buildAuthRequestData } = useAuth();
    const { openModal } = useModal();
    const [questions, setQuestions] = useState<models.dtos.QuestionDto[]>([]);
    const previewQuestion = (question: models.interfaces.Question) =>
        openModal(QuestionPeekModal, { question });
    const columns: Column[] = [
        {
            label: "Title",
            isFromData: true,
            key: "title",
            sortable: true,
            template: ({ data }) => <Ellipsis data={data} maxLength={10} direction="right" />,
        },
        {
            label: "Labels",
            isFromData: true,
            key: "label",
            sortable: true,
            largeColumn: true,
            template: ({ data }) => <span>{data}</span>,
        },
        {
            label: "",
            isFromData: true,
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => <Icon icon="preview" onClick={(e) => { e.stopPropagation(); previewQuestion(data) }} />,
        }
    ];

    //get field questions.
    useEffect(() => {
        questionService
            .getAllQuestions(buildAuthRequestData())
            .then(({ data }) => setQuestions(data));
    }, [setQuestions, buildAuthRequestData]);

    const onRowClicked = (question: models.interfaces.Question) => {
        const questionIndex = test.questions.findIndex(qId => qId === question.id);
        if (questionIndex < 0) {
            test.questions.push(question.id!);
        } else {
            test.questions.splice(questionIndex, 1);
        }
        onChange({ questions: test.questions });
    };

    return (
        <div className="container">
            <DataTable columns={columns} data={questions} onRowClick={onRowClicked} />
        </div>
    )
}