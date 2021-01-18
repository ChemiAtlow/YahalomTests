import { models } from "@yahalom-tests/common";
import React, { useEffect, useState } from "react";
import DataTable from "../components/Table";
import { questionService } from "../services";

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
			<DataTable data={questions} />
		</div>
	);
};

export default Questions;
