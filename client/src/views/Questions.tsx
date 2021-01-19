import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import { Switch, useHistory, useRouteMatch } from "react-router-dom";
import { Ellipsis, AppButton, DataTable, Column, ProtectedRoute } from "../components";
import { questionService } from "../services";
import EditQuestion from "./Edit Question/EditQuestion";

const columns: Column[] = [
	{
		label: "Title",
		isFromData: true,
		key: "title",
		template: ({ data }) => (
			<Ellipsis data={data} maxLength={50} direction="right" />
		),
	},
	{
		label: "Type",
		isFromData: true,
		key: "type",
		template: ({ data }) => <span>{data === 0 ? "Single choice" : "Multi choice"}</span>,
	},
	{
		label: "Last Update",
		isFromData: true,
		key: "lastUpdate",
		template: ({ data }) => <span>{new Date(data).toLocaleString()}</span>
	},
	{
		label: "Usage count",
		isFromData: true,
		key: "testCount",
		template: ({ data }) => <span>{data || 0}</span>
	},
	{
		label: "",
		isFromData: true,
		key: "active",
	},
];

const Questions: React.FC = () => {
	const [questions, setQuestions] = useState<models.interfaces.Question[]>([]);
	const { path, url } = useRouteMatch();
	console.log(`path : ${path} url: ${url}`);
	const { push } = useHistory();
	useEffect(() => {
		questionService
			.getAllQuestions()
			.then(({ data }) => setQuestions(data));
	}, [setQuestions]);
	return (
		<div>
			<Switch>
				<ProtectedRoute requiresField path={path} exact>
					<h1>Questions</h1>
					<AppButton onClick={()=> push(`${url}/edit`) }>Add new question</AppButton>
					<DataTable data={questions} columns={columns} />
				</ProtectedRoute>
				<ProtectedRoute requiresField path={`${path}/edit/:questionId?`}>
					<EditQuestion></EditQuestion>
				</ProtectedRoute>
			</Switch>
		</div>
	);
};

export default Questions;
