import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import Ellipsis from "../components/Ellipsis";
import { AppButton } from "../components/Forms";
import DataTable, { Column } from "../components/Table";
import { questionService } from "../services";

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
		template: ({data})=> <span>{data===0 ? "Single choice":"Multi choice"}</span>,
	},
	{
		label: "Last Update",
		isFromData: true,
		key: "lastUpdate",
		template: ({data}) => <span>{new Date(data).toLocaleString()}</span>
	},
	{
		label: "Usage count",
		isFromData: true,
		key: "testCount",
		template: ({data}) => <span>{data || 0}</span>
	},
	{
		label: "",
		isFromData: true,
		key: "active",
	}
];

const Questions: React.FC = () => {
	const [questions, setQuestions] = useState<models.interfaces.Question[]>([]);

	useEffect(() => {
		questionService
			.getAllQuestions()
			.then(({ data }) => setQuestions(data));
	}, [setQuestions]);
	return (
		<div>
			<h1>Questions</h1>
			<AppButton>Add new question</AppButton>
			<DataTable data={questions} columns={columns} />
		</div>
	);
};

export default Questions;
