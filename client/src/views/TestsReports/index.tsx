import { constants, models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Autocomplete, Column, Container, DataTable, DatePicker, ErrorModal, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { testService } from "../../services";
import StudentReport from "./TestReport";
import "./TestReports.scoped.scss";

const monthAgo = new Date(Date.now() - constants.TIME.month);

const TestsReports: React.FC = () => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [tests, setTests] = useState<models.interfaces.Test[]>([]);
    const [testsAutoComplete, setTestsAutoComplete] = useState<string[]>([]);
    const { path, url } = useRouteMatch();
    const { push } = useHistory();
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();

    const columns: Column[] = [
        {
            label: "Test Name",
            key: "title",
            sortable: true,
        },
        {
            label: "Created by",
            key: "teacherEmail",
            sortable: true,
        },
        {
            label: "Question review",
            key: "isReviewEnabled",
            sortable: true,
            template: ({ data }) => <span>{data ? "Allowed" : "No Review"}</span>,
        },
        {
            label: "Last Update",
            key: "lastUpdate",
            sortable: true,
            template: ({ data }) => <Tooltip value={new Date(data).toLocaleString()} >{new Date(data).toLocaleDateString()}</Tooltip>,
        },
        {
            label: "",
            key: "id",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value="View test's reports"
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
        const suggestions = tests.flatMap(({ title, id, teacherEmail }) => [title, id ?? "", teacherEmail]);
        setTestsAutoComplete(suggestions);
    }, [tests, setTestsAutoComplete]);
    useEffect(() => {
        setLoadingState("loading");
        testService
            .getAllTests(buildAuthRequestData())
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
                        <div id="range-selector">
                            <DatePicker label="Start date" initialDate={monthAgo} onChange={() => {}} />
                            <DatePicker label="End date" onChange={() => {}} />
                        </div>
                        <Autocomplete options={testsAutoComplete} label="Search by test name/id/creator" value={search} onChange={setSearch} />
                    </SearchRow>
                    <DataTable data={tests} columns={columns} searchTerm={search} searchKeys={["id", "title"]} />
                </Container>
            </Route>
            <Route path={`${path}/:testId`} component={StudentReport}/>
        </Switch>
    );
};

export default TestsReports;
