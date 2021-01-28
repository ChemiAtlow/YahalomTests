import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import {
    AppButton,
    Column,
    Container,
    DataTable,
    Ellipsis,
    FormField,
    Icon,
    SearchRow,
    TestLinkModal,
    Tooltip,
} from "../../components";
import { useAuth, useModal } from "../../hooks";
import { testService } from "../../services";
import EditTest from "./EditTest";

const Tests: React.FC = () => {
    const { path } = useRouteMatch();
    const { push } = useHistory();
    const [tests, setTests] = useState<models.interfaces.Test[]>([]);
    const [search, setSearch] = useState("");
    const { getOrganizationAndFieldUrl, buildAuthRequestData } = useAuth();
    const { openModal } = useModal();

    const goToEditTest = (test: models.interfaces.Test) =>
        push(getOrganizationAndFieldUrl("tests", "edit", test.id!), { test });
    const goToTestStatitistics = (test: models.interfaces.Test) =>
        console.warn("Statistics page is not yet implemented!", test);
    const showLinkToTest = ({ title, id }: models.interfaces.Test) => {
        openModal(TestLinkModal, { title, id: id! })
    }
    

    const columns: Column[] = [
        {
            label: "Test name",
            key: "title",
            sortable: true,
            largeColumn: true,
            template: ({ data }) => <Ellipsis data={data} maxLength={50} direction="right" />,
        },
        {
            label: "Question count",
            key: "questions",
            sortable: true,
            template: ({ data }) => <span>{data.length}</span>,
        },
        {
            label: "Last Update",
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
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip value="Click to view test statistics." direction="left">
                    <Icon icon="statistics" onClick={() => goToTestStatitistics(data)} />
                </Tooltip>
            ),
        },
        {
            label: "",
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip value="Click to edit the test." direction="left">
                    <Icon icon="edit" onClick={() => goToEditTest(data)} />
                </Tooltip>
            ),
        },
        {
            label: "",
            key: "*",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip value="Click to get link to the test." direction="left">
                    <Icon icon="link" onClick={() => showLinkToTest(data)} />
                </Tooltip>
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

    useEffect(() => {
        testService.getAllTests(buildAuthRequestData()).then(({ data }) => setTests(data));
    }, [setTests, buildAuthRequestData]);

    return (
        <Switch>
            <Route path={path} exact>
                <Container>
                    <h1>Tests</h1>
                    <SearchRow>
                        <AppButton
                            onClick={() => push(getOrganizationAndFieldUrl("tests", "edit"))}>
                            Add new test
                        </AppButton>

                        <FormField
                            label="Search by title"
                            type="text"
                            search
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </SearchRow>
                    <DataTable data={tests} columns={columns} searchTerm={search} />
                </Container>
            </Route>
            <Route requiresField path={`${path}/edit/:testId?`}>
                <EditTest onTestAddedOrEdited={onTestChanged} />
            </Route>
        </Switch>
    );
};

export default Tests;
