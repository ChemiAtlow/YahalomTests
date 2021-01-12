import React, { useEffect, useState } from "react";
import { models } from "../../../common";
import { questionService } from "../services";
import QuestionsForm from "./questionsForm";
import QuestionsTable from "./questionsTable";

const Questions: React.FC = () => {
	const [questions, setQuestions] = useState<models.Question[]>([]);
	useEffect(() => {
		getQuestions();
	});

	const getQuestions = async () => {
		const { data: questionsRes } = await questionService.getAllQuestions();
		setQuestions(questionsRes);
	};

	const addQuestion = async (question: { title: string }) => {
		const { data: addedQuestion } = await questionService.addQuestion(
			question
		);
		setQuestions([...questions, addedQuestion]);
	};

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
