import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useModal } from "../../../hooks";
import { models } from '@yahalom-tests/common';
import { AppButton, Autocomplete, Column, Container, DataTable, Ellipsis, Icon, QuestionPeekModal, SearchRow } from '../../../components';
import { questionService } from '../../../services';
import type { TestQuestionsKeys } from './types';

interface TestQuestionsProps {
    test: TestQuestionsKeys;
    onChange: (change: TestQuestionsKeys) => void;
}

export const TestQuestions: React.FC<TestQuestionsProps> = ({ test, onChange }) => {
    //set test prop as component state.
    const { buildAuthRequestData } = useAuth();
    const questions = questionService.getAllQuestions.read(buildAuthRequestData()) || [];
    const { openModal } = useModal();
    const [questionsAutoComplete, setQuestionsAutoComplete] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const filteredQuestions = useRef<models.interfaces.Question[]>([]);
    const [activeRows, setActiveRows] = useState<{ key: 'id'; rows: models.classes.guid[] }>({
        key: 'id',
        rows: test.questions,
    });
    const previewQuestion = (question: models.interfaces.Question) =>
        openModal(QuestionPeekModal, { question });
    const columns: Column[] = [
        {
            label: 'Title',
            key: 'title',
            sortable: true,
            template: ({ data }) => <Ellipsis data={data} maxLength={10} direction="right" />,
        },
        {
            label: 'Labels',
            key: 'label',
            sortable: true,
            largeColumn: true,
            template: ({ data }) => <span>{data}</span>,
        },
        {
            label: '',
            key: '*',
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Icon
                    icon="preview"
                    onClick={(e) => {
                        e.stopPropagation();
                        previewQuestion(data);
                    }}
                />
            ),
        },
    ];

    useEffect(() => {
        const labels = questions.flatMap(({ label }) => label.split(/[ ,]+/));
        const uniqueLabels = [...new Set(labels)];
        setQuestionsAutoComplete(uniqueLabels);
    }, [questions, setQuestionsAutoComplete]);
    useEffect(() => {
        setActiveRows({ key: 'id', rows: test.questions });
    }, [setActiveRows, test.questions]);

    const clearAllSelected = () => {
        onChange({ questions: [] });
    };
    const selectAllVisible = () => {
        const visibleQuestionsIds = filteredQuestions.current.map((q) => q.id!);
        onChange({ questions: [...new Set(test.questions.concat(visibleQuestionsIds))] });
    };

    const onRowClicked = (question: models.interfaces.Question) => {
        const questionIndex = test.questions.findIndex((qId) => qId === question.id);
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
                <Autocomplete
                    label="Search by label"
                    options={questionsAutoComplete}
                    value={search}
                    onChange={setSearch}
                />
            </SearchRow>
            <DataTable
                columns={columns}
                data={questions}
                onRowClick={onRowClicked}
                onDataFiltered={(filtered) => (filteredQuestions.current = filtered)}
                searchKeys={['label']}
                searchTerm={search}
                activeRows={activeRows}
            />
        </Container>
    );
};