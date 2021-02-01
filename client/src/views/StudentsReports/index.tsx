import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Column, Container, DataTable, ErrorModal, FormField, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";
import StudentReport from "./StudentReport";

const StudentsReports: React.FC = () => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState<models.interfaces.Student[]>([]);
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
                        <FormField label="Search" type="text" search value={search} onChange={e => setSearch(e.target.value)} />
                    </SearchRow>
                    <DataTable data={students} columns={columns} searchTerm={search} searchKeys={["email", "firstName", "lastName"]} />
                </Container>
            </Route>
            <Route path={`${path}/:studentEmail`} component={StudentReport}/>
        </Switch>
    );
};

export default StudentsReports;
