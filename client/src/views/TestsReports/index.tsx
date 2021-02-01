import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Column, Container, DataTable, ErrorModal, FormField, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { testService } from "../../services";
import TestReport from "./TestReport";

const TestsReports: React.FC = () => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [tests, setTests] = useState<models.interfaces.Test[]>([]);
    const { path, url } = useRouteMatch();
    const { push } = useHistory();
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();

    const columns: Column[] = [
        {
            label: "Title",
            key: "title",
            sortable: true,
        },
        {
            label: "Created by",
            key: "teacherEmail",
            sortable: true,
        },
        {
            label: "Last Update",
            key: "lastUpdate",
            sortable: true,
            template: ({ data }) => <Tooltip value={new Date(data).toLocaleString()} >{new Date(data).toLocaleDateString()}</Tooltip>,
        },
        {
            label: "Pass grade",
            key: "minPassGrade",
            sortable: true
        },
        {
            label: "",
            key: "id",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value="View tests's reports"
                    direction="left">
                    <Icon
                        icon="preview"
                        onClick={() => goToTestReports(data)}
                    />
                </Tooltip>
            ),
        },
    ];

    const goToTestReports = (id: models.classes.guid) => {
        push(`${url}/${id}`);
    };

    useEffect(() => {
        setLoadingState("loading");
        testService.getAllTests(
            buildAuthRequestData())
            .then(({ data }) => setTests(data))
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch tests. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setTests, buildAuthRequestData, setLoadingState, openModal]);

    return (
        //need to add search by date
        <Switch>
            <Route path={path} exact>
                <Container>
                    <h1>Tests reports</h1>
                    <SearchRow>
                        <span></span>
                        <FormField label="Search" type="text" search value={search} onChange={e => setSearch(e.target.value)} />
                    </SearchRow>
                    <DataTable data={tests} columns={columns} searchTerm={search} searchKeys={["title", "minPassGrade"]} />
                </Container>
            </Route>
            <Route path={`${path}/:testId`} component={TestReport} />
        </Switch>
    );
};

export default TestsReports;
