import React, { useState, useEffect } from 'react';
import { useAuth, useModal } from "../../../hooks";
import { models } from '@yahalom-tests/common';
import { AppButton, Column, Container, DataTable, Ellipsis, FormField, Icon, QuestionPeekModal, SearchRow } from '../../../components';
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
    const [search, setSearch] = useState("");
    const [activeRows, setActiveRows] = useState<{ key: "id"; rows: models.classes.guid[] }>({ key: "id", rows: test.questions })
    const previewQuestion = (question: models.interfaces.Question) =>
        openModal(QuestionPeekModal, { question });
    const columns: Column[] = [
        {
            label: "Title",
            key: "title",
            sortable: true,
            template: ({ data }) => <Ellipsis data={data} maxLength={10} direction="right" />,
        },
        {
            label: "Labels",
            key: "label",
            sortable: true,
            largeColumn: true,
            template: ({ data }) => <span>{data}</span>,
        },
        {
            label: "",
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
    useEffect(() => {
        setActiveRows({ key: "id", rows: test.questions });
    }, [setActiveRows, test.questions]);

    const clearAllSelected = () => {
        onChange({ questions: [] });
    };
    const selectAllVisible = () => {
        // const visibleQuestionsIds = filteredQuestions.map(q => q.id!);
        // onChange({ questions: visibleQuestionsIds });
    };

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
        <Container>
            <p>Total questions selected for the test: {test.questions.length}</p>
            <SearchRow>
                <div>
                    <AppButton color="error" type="button" onClick={clearAllSelected}>
                        Clear all
                    </AppButton>
                    <AppButton type="button" onClick={selectAllVisible}>
                        Select all visible
                    </AppButton>
                </div>
                <FormField
                    label="Search by label"
                    type="text"
                    search
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </SearchRow>
            <DataTable
                columns={columns}
                data={questions}
                onRowClick={onRowClicked}
                // onDataFiltered={setFilteredQuestions}
                searchKeys={["label"]}
                searchTerm={search}
                activeRows={activeRows}
            />
        </Container>
    );
}