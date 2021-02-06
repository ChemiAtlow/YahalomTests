import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Autocomplete, Column, Container, DataTable, ErrorModal, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";
import StudentReport from "./StudentReport";

const StudentsReports: React.FC = () => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState<models.interfaces.Student[]>([]);
    const [studentsAutoComplete, setStudentsAutoComplete] = useState<string[]>([]);
    const { path, url } = useRouteMatch();
    const { push } = useHistory();
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();

    const columns: Column[] = [
        {
            label: "First Name",
            key: "firstName",
            sortable: true,
        },
        {
            label: "Last Name",
            key: "lastName",
            sortable: true,
        },
        {
            label: "Email",
            key: "email",
            sortable: true,
        },
        {
            label: "Last Update",
            key: "lastActivity",
            sortable: true,
            template: ({ data }) => <Tooltip value={new Date(data).toLocaleString()} >{new Date(data).toLocaleDateString()}</Tooltip>,
        },
        {
            label: "",
            key: "email",
            sortable: false,
            smallColumn: true,
            template: ({ data }) => (
                <Tooltip
                    value="View student's reports"
                    direction="left">
                    <Icon
                        icon="preview"
                        onClick={() => goToStudentReports(data)}
                    />
                </Tooltip>
            ),
        },
    ];

    const goToStudentReports = (email: string) => {
        push(`${url}/${email}`);
    };

    useEffect(() => {
        const suggestions = students.flatMap(({ firstName, lastName, email }) => [firstName, lastName, email]);
        setStudentsAutoComplete(suggestions);
    }, [students, setStudentsAutoComplete]);
    useEffect(() => {
        setLoadingState("loading");
        reportService
            .getAllStudents(buildAuthRequestData())
            .then(({ data }) => setStudents(data))
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch students. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setStudents, buildAuthRequestData, setLoadingState, openModal]);

    return (
        <Switch>
            <Route path={path} exact>
                <Container>
                    <h1>Students reports</h1>
                    <SearchRow>
                        <span></span>
                        <Autocomplete options={studentsAutoComplete} label="Search" value={search} onChange={setSearch} />
                    </SearchRow>
                    <DataTable data={students} columns={columns} searchTerm={search} searchKeys={["email", "firstName", "lastName"]} />
                </Container>
            </Route>
            <Route path={`${path}/:studentEmail`} component={StudentReport}/>
        </Switch>
    );
};

export default StudentsReports;
