import React, { useEffect, useState } from "react";
import type { models } from "@yahalom-tests/common";
import { questionService } from "../services";
import QuestionsForm from "./questionsForm";
import QuestionsTable from "./questionsTable";

const Questions: React.FC = () => {
	const [questions, setQuestions] = useState<models.interfaces.Question[]>(
		[]
	);

	const addQuestion = async (question: { title: string }) => {
		const { data: addedQuestion } = await questionService.addQuestion(
			question
		);
		setQuestions([...questions, addedQuestion]);
	};

	useEffect(() => {
		questionService
			.getAllQuestions()
			.then(({ data }) => setQuestions(data));
	}, [setQuestions]);

	return (
		<div className="container questions">
			<div className="side">
				<h1>Questions List</h1>
				<QuestionsTable questions={questions} />
			</div>
			<div className="side">
				<h1>Add a new question</h1>
				<QuestionsForm onAddQuestion={addQuestion} />
			</div>
		</div>
	);
};

export default Questions;
