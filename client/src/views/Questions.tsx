import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import DataTable, { Column } from "../components/Table";
import Tooltip from "../components/Tooltip";
import { questionService } from "../services";

const columns: Column[] = [
	{
		label: "Id",
		isFromData: true,
		key: "id",
	},
	{
		label: "Question title",
		isFromData: true,
		key: "title",
		template: ({ data }) => (
			<Tooltip value={data} direction="right">
				{data}
			</Tooltip>
		),
	},
];

const Questions: React.FC = () => {
	const [questions, setQuestions] = useState<models.interfaces.Question[]>(
		[]
	);

	useEffect(() => {
		questionService
			.getAllQuestions()
			.then(({ data }) => setQuestions(data));
	}, [setQuestions]);
	return (
		<div>
			<h1>Questions</h1>
			<DataTable data={questions} columns={columns} />
		</div>
	);
};

export default Questions;
