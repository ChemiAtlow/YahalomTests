import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import {
    Ellipsis,
    AppButton,
    DataTable,
    Column,
    Icon,
    Tooltip,
    ErrorModal,
    Container,
    SearchRow,
    Autocomplete,
} from '../../components';
import { questionService } from "../../services";
import { useAuth, useModal } from "../../hooks";
import EditQuestion from "./EditQuestion";

const Questions: React.FC = () => {
    const [questions, setQuestions] = useState<models.interfaces.Question[]>([]);
    const [questionsAutoComplete, setQuestionsAutoComplete] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const { path } = useRouteMatch();
    const { push } = useHistory();
    const { openModal } = useModal();
    const { getOrganizationAndFieldUrl, buildAuthRequestData } = useAuth();
    const removeQuestion = async (id: models.classes.guid) => {
        try {
            const { data } = await questionService.deleteQuestion(buildAuthRequestData(), id);
            setQuestions(questions.filter(q => q.id !== data.id));
        } catch (err) {
            openModal(ErrorModal, {
                title: "Delete failure!",
                body: `Delete has failed: ${err.message}`,
            });
        }
    };
    const goToEditQuestion = (question: models.interfaces.Question) =>
        push(getOrganizationAndFieldUrl("questions", "edit", question.id!), { question });
    const columns: Column[] = [
        {
            label: "Title",
            key: "title",
            sortable: true,
            largeColumn: true,
            template: ({ data }) => <Ellipsis data={data} maxLength={50} direction="right" />,
        },
        {
            label: "Type",
            key: "type",
            sortable: true,
            template: ({ data }) => <span>{data === 0 ? "Single choice" : "Multi choice"}</span>,
        },
        {
            label: "Last Update",
            key: "lastUpdate",
            sortable: true,
            template: ({ data }) => <span>{new Date(data).toLocaleString()}</span>,
        },
        {
            label: "Usage count",
            key: "testCount",
            sortable: true,
            template: ({ data }) => <span>{data || 0}</span>,
        },
        {
            label: "",
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value={data.active ? "Question is active" : "Remove question."}
                    direction="left">
                    <Icon
                        icon={data.active ? "active" : "trash"}
                        onClick={data.active ? undefined : () => removeQuestion(data.id)}
                    />
                </Tooltip>
            ),
        },
        {
            label: "",
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip value="Click to edit the question." direction="left">
                    <Icon icon="edit" onClick={() => goToEditQuestion(data)} />
                </Tooltip>
            ),
        },
    ];
    const onQuestionAddedOrEdited = (question: models.interfaces.Question) => {
        const existingQuestionIndex = questions.findIndex(q => q.id === question.id);
        if (existingQuestionIndex >= 0) {
            questions[existingQuestionIndex] = { ...questions[existingQuestionIndex], ...question };
        } else {
            questions.push(question);
        }
        setQuestions(questions);
    };
    useEffect(() => {
        const titles = questions.map(({ title }) => title);
        setQuestionsAutoComplete(titles);
    }, [questions, setQuestionsAutoComplete]);
    useEffect(() => {
        questionService
            .getAllQuestions(buildAuthRequestData())
            .then(({ data }) => setQuestions(data));
    }, [setQuestions, buildAuthRequestData]);
    return (
        <Switch>
            <Route path={path} exact>
                <Container>
                    <h1>Questions</h1>
                    <SearchRow>
                        <AppButton
                            onClick={() =>
                                push(getOrganizationAndFieldUrl('questions', 'edit'))
                            }>
                            Add new question
                        </AppButton>
                        <Autocomplete
                            label="Search by title"
                            options={questionsAutoComplete}
                            value={search}
                            onChange={setSearch}
                        />
                    </SearchRow>
                    <DataTable
                        data={questions}
                        columns={columns}
                        searchTerm={search}
                        searchKeys={['title']}
                    />
                </Container>
            </Route>
            <Route path={`${path}/edit/:questionId?`}>
                <EditQuestion onQuestionAddedOrEdited={onQuestionAddedOrEdited} />
            </Route>
        </Switch>
    );
};

export default Questions;
