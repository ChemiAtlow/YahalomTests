import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Autocomplete, Column, Container, DataTable, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth } from "../../hooks";
import { reportService } from "../../services";
import StudentReport from "./StudentReport";

const StudentsReports: React.FC = () => {
    const { buildAuthRequestData } = useAuth();
    const students = reportService.getAllStudents.read(buildAuthRequestData()) || [];
    const [search, setSearch] = useState("");
    const [studentsAutoComplete, setStudentsAutoComplete] = useState<string[]>([]);
    const { path, url } = useRouteMatch();
    const { push } = useHistory();

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
