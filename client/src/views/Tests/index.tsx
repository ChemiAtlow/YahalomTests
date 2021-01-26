import { models } from "@yahalom-tests/common";
import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { AppButton, Column, DataTable, Ellipsis, Icon, Tooltip } from "../../components";
import { useAuth } from "../../hooks";
import EditTest from "./EditTest";

const Tests: React.FC = () => {
    const { path } = useRouteMatch();
    const { push } = useHistory();
    const { getOrganizationAndFieldUrl } = useAuth();
    const goToEditTest = (id: models.classes.guid) =>
        push(getOrganizationAndFieldUrl("tests", "edit", id));

    const columns: Column[] = [
        {
            label: "Test name",
            isFromData: true,
            key: "title",
            sortable: true,
            largeColumn: true,
            template: ({ data }) => <Ellipsis data={data} maxLength={50} direction="right" />,
        },
        {
            label: "Question count",
            isFromData: true,
            key: "questions",
            sortable: true,
            template: ({ data }) => <span>{data.length}</span>,
        },
        {
            label: "Last Update",
            isFromData: true,
            key: "lastUpdate",
            sortable: true,
            template: ({ data }) => {
                const date = new Date(data);
                return (
                    <Tooltip value={date.toLocaleString()}>
                        <span>{date.toLocaleDateString()}</span>
                    </Tooltip>
                );
            },
        },
        {
            label: "",
            isFromData: true,
            key: "id",
            sortable: false,
            template: ({ data }) => (
                <div>
                    <Tooltip value="Click to view test statistics." direction="left">
                        <Icon icon="statistics" onClick={() => goToEditTest(data)} />
                    </Tooltip>
                    <Tooltip value="Click to edit the test." direction="left">
                        <Icon icon="edit" onClick={() => goToEditTest(data)} />
                    </Tooltip>
                    <Tooltip value="Click to get link to the test." direction="left">
                        <Icon icon="link" onClick={() => goToEditTest(data)} />
                    </Tooltip>
                </div>
            ),
        },
    ];
    return (
        <div>
            <Switch>
                <Route path={path} exact>
                    <div>
                        <h1>Tests</h1>
                        <AppButton
                            onClick={() => push(getOrganizationAndFieldUrl("tests", "edit"))}>
                            Add new test
                        </AppButton>
                        <DataTable data={[]} columns={columns} />
                    </div>
                </Route>
                <Route requiresField path={`${path}/edit/:testId?`}>
                    <EditTest />
                    {/* <EditQuestion /> */}
                </Route>
            </Switch>
        </div>
    );
};

export default Tests;
