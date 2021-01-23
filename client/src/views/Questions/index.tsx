import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Switch, useHistory, useRouteMatch } from "react-router-dom";
import {
    Ellipsis,
    AppButton,
    DataTable,
    Column,
    ProtectedRoute,
    Icon,
    Tooltip,
} from "../../components";
import { questionService } from "../../services";
import { useAuth } from "../../hooks";
import EditQuestion from "./EditQuestion";

const columns: Column[] = [
    {
        label: "Title",
        isFromData: true,
        key: "title",
        sortable: true,
        largeColumn: true,
        template: ({ data }) => <Ellipsis data={data} maxLength={50} direction="right" />,
    },
    {
        label: "Type",
        isFromData: true,
        key: "type",
        sortable: true,
        template: ({ data }) => <span>{data === 0 ? "Single choice" : "Multi choice"}</span>,
    },
    {
        label: "Last Update",
        isFromData: true,
        key: "lastUpdate",
        sortable: true,
        template: ({ data }) => <span>{new Date(data).toLocaleString()}</span>,
    },
    {
        label: "Usage count",
        isFromData: true,
        key: "testCount",
        sortable: true,
        template: ({ data }) => <span>{data || 0}</span>,
    },
    {
        label: "",
        isFromData: true,
        key: "*",
        sortable: false,
        smallColumn: true,
        template: ({ data }) => (
            <Tooltip
                value={data.active ? "Question is active" : "Remove question."}
                direction="left">
                <Icon icon={data.active ? "active" : "trash"} />
            </Tooltip>
        ),
    },
    {
        label: "",
        isFromData: true,
        key: "id",
        sortable: false,
        smallColumn: true,
        template: ({ data }) => (
            <Tooltip value="Click to edit the question." direction="left">
                <Icon icon="edit" />
            </Tooltip>
        ),
    },
];

const Questions: React.FC = () => {
    const [questions, setQuestions] = useState<models.interfaces.Question[]>([]);
    const { path } = useRouteMatch();
    const { push } = useHistory();
    const { getOrganizationAndFieldUrl } = useAuth();
    useEffect(() => {
        questionService.getAllQuestions().then(({ data }) => setQuestions(data));
    }, [setQuestions]);
    return (
        <div>
            <Switch>
                <ProtectedRoute requiresField path={path} exact>
                    <h1>Questions</h1>
                    <AppButton
                        onClick={() => push(getOrganizationAndFieldUrl("questions", "edit"))}>
                        Add new question
                    </AppButton>
                    <DataTable data={questions} columns={columns} />
                </ProtectedRoute>
                <ProtectedRoute requiresField path={`${path}/edit/:questionId?`}>
                    <EditQuestion />
                </ProtectedRoute>
            </Switch>
        </div>
    );
};

export default Questions;
