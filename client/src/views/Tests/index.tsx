import { models } from "@yahalom-tests/common";
import React, { useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { AppButton, Column, DataTable, Ellipsis, Icon, Tooltip } from "../../components";
import { useAuth } from "../../hooks";
import EditTest from "./EditTest";

const Tests: React.FC = () => {
    const { path } = useRouteMatch();
    const { push } = useHistory();
    const [tests, setTests] = useState<models.interfaces.Test[]>([]);
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
    const onTestChanged = (test: models.interfaces.Test) => {
        const existingTestIndex = tests.findIndex(t => t.id === test.id);
        if (existingTestIndex >= 0) {
            tests[existingTestIndex] = { ...tests[existingTestIndex], ...test };
        } else {
            tests.push(test);
        }
        setTests(tests);
        console.log(test);
    };
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
                        <DataTable data={tests} columns={columns} />
                    </div>
                </Route>
                <Route requiresField path={`${path}/edit/:testId?`}>
                    <EditTest onTestAddedOrEdited={onTestChanged} />
                </Route>
            </Switch>
        </div>
    );
};

export default Tests;
