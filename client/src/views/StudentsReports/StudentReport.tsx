import { models } from "@yahalom-tests/common";
import React, { useEffect, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { Autocomplete, Column, Container, DataTable, ExamReviewModal, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useModal } from "../../hooks";
import { reportService } from "../../services";

interface StudentReportProps {
    match: match<{ studentEmail: string }>;
}

const StudentReport: React.FC<StudentReportProps> = ({ match }) => {
    const { buildAuthRequestData } = useAuth();
    const { studentEmail } = match.params;
    const examResults = reportService.getStudentReports.read(buildAuthRequestData(), studentEmail) || [];
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [examsAutoComplete, setExamsAutoComplete] = useState<string[]>([]);

    const columns: Column[] = [
        {
            label: "Test name",
            key: "title",
            sortable: true,
        },
        {
            label: "Grade",
            key: "grade",
            sortable: true,
        },
        {
            label: "Last activity",
            key: "completionDate",
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
                    value="View student's answers"
                    direction="left">
                    <Icon
                        icon="preview"
                        onClick={() => openStudentExamResult(data)}
                    />
                </Tooltip>
            ),
        },
    ];

    const openStudentExamResult = (id: models.classes.guid) => {
        const examResult = examResults.find(ex => ex.id === id);
        if (!examResult) { return; }
        openModal(ExamReviewModal, { examResult });
    };

    const average = useMemo(() => {
        const totalGrades = examResults.reduce((prev, { grade }) => prev + grade, 0);
        return Math.ceil(totalGrades / examResults.length);
    }, [examResults]);

    useEffect(() => {
        const suggestions = examResults.flatMap(({ title,id }) => [title,id]);
        setExamsAutoComplete(suggestions);
    }, [examResults, setExamsAutoComplete]);

    return (
        <Container>
            <h1>Student report</h1>
            <SearchRow>
                <div>
                    <b>Email:</b> {studentEmail}. <b>Average grade:</b> {average}.
                </div>
                <Autocomplete options={examsAutoComplete} label="Search by test name/id" value={search} onChange={setSearch} />
            </SearchRow>
            <DataTable data={examResults} columns={columns} searchTerm={search} searchKeys={["id", "test", "title"]} />
        </Container>
    );
};

export default StudentReport;
