import { models } from "@yahalom-tests/common";
import React, { useEffect, useMemo, useState } from "react";
import { match } from "react-router-dom";
import { Column, Container, DataTable, ErrorModal, ExamReviewModal, FormField, Icon, SearchRow, Tooltip } from "../../components";
import { useAuth, useLoading, useModal } from "../../hooks";
import { reportService } from "../../services";

interface TestReportProps {
    match: match<{ testId: models.classes.guid }>;
}

const TestReport: React.FC<TestReportProps> = ({ match }) => {
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [examResults, setExamResults] = useState<models.interfaces.ExamResult[]>([]);
    const { setLoadingState } = useLoading();
    const { buildAuthRequestData } = useAuth();
    const { testId } = match.params;

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
        setLoadingState("loading");
        reportService.getTestReport(
            buildAuthRequestData(), testId)
            // .then(({ data }) => setExamResults(data))
            .catch(() =>
                openModal(ErrorModal, { title: "Error", body: "Couldn't fetch student exam results. try later." }))
            .finally(() => setLoadingState("success"));
    }, [setExamResults, buildAuthRequestData, setLoadingState, openModal, testId]);

    return (
        <Container>
            <h1>Student report</h1>
            <SearchRow>
                <div>
                    <b>Email:</b> {testId}. <b>Average grade:</b> {average}.
                </div>
                <FormField label="Search by test name/id" type="text" search value={search} onChange={e => setSearch(e.target.value)} />
            </SearchRow>
            <DataTable data={examResults} columns={columns} searchTerm={search} searchKeys={["id", "test", "title"]} />
        </Container>
    );
};

export default TestReport;
