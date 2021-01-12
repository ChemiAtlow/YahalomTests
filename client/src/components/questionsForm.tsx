import React, { useState } from "react";
import { models } from "../../../common";

const QuestionsForm: React.FC<{
	onAddQuestion: (question: { title: string }) => Promise<void>;
}> = ({ onAddQuestion }) => {
	const [title, setTitle] = useState("");
	const [errors, setErrors] = useState<
		Partial<Record<keyof models.Question, string>>
	>({});
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.currentTarget.value);
		setErrors({});
	};

	const validate = () => {
		const errors: Partial<Record<keyof models.Question, string>> = {};
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
