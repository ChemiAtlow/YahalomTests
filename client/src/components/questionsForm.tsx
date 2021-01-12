import React, { useState } from "react";
import type { models } from "../../../common";

interface QuestionsFromProps {
	onAddQuestion: (question: models.Question) => Promise<void>;
}
type ErrorValues = Partial<Record<keyof models.Question, string>>;

const QuestionsForm: React.FC<QuestionsFromProps> = ({ onAddQuestion }) => {
	const [title, setTitle] = useState("");
	const [errors, setErrors] = useState<ErrorValues>({});
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.currentTarget.value);
		setErrors({});
	};

	const validate = () => {
		const errors: ErrorValues = {};
		if (!title.trim().length) errors.title = "Title is required.";

		return Object.keys(errors).length === 0 ? null : errors;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const errors = validate();
		setErrors(errors ?? {});
		if (errors) return;

		const questionToAdd = { title: title };
		onAddQuestion(questionToAdd);
		setTitle("");
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="form-group space">
					<label htmlFor="title">Title: </label>
					<input
						value={title}
						onChange={handleChange}
						id="title"
						type="text"
						className="input form-control"
					/>
					{errors.title && (
						<div className="alert alert-danger">{errors.title}</div>
					)}
				</div>
				<button className="btn btn-primary btn-sm">Add question</button>
			</form>
		</div>
	);
};

export default QuestionsForm;
