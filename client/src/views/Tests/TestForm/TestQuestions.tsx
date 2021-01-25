import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../hooks";
import { models } from '@yahalom-tests/common';
import { QuestionAnswer, Row } from '../../../components';
import { questionService } from '../../../services';

export const TestQuestions: React.FC<models.dtos.TestDto> = (testProp) => {
    //set test prop as component state.
    const [test, setTest] = useState<models.dtos.TestDto>({ ...testProp });
    const { buildAuthRequestData } = useAuth();
    const [questions, setQuestions] = useState<models.dtos.QuestionDto[]>([]);

    //get test questions.
    //test state has questionsIds.
    //should think about getQuestionsByTest method..
    useEffect(() => {
        questionService
            .getAllQuestions(buildAuthRequestData())
            .then(({ data }) => setQuestions([...data]));
    }, [setQuestions, buildAuthRequestData]);

    const onContentChange = (e: React.ChangeEvent<HTMLInputElement>, answerIndex: number, questionIndex: number) => {
        const { answers } = questions[questionIndex];
        const { value } = e.target;
        answers[answerIndex].content = value;
        //check automatocaly add new answer
        if (answers.length < 10 && answerIndex === answers.length - 1 && value) {
            answers.push({ content: "", correct: false });
        } else if (answerIndex === answers.length - 2 && !value && !answers?.[answerIndex + 1]?.content) {
            answers.pop();
        }
        setQuestions([...questions]);
    };
    const onSelectionChanged = (e: React.ChangeEvent<HTMLInputElement>, index: number, questionIndex: number) => {
        //check if question is singlechoice
        const { type, answers } = questions[questionIndex];
        if (type === models.enums.QuestionType.SingleChoice) {
            answers.forEach((answer, i) => {
                answer.correct = index === i;
            })
        }
        else {
            answers[index].correct = e.target.checked;
        }
        setQuestions([...questions]);
    };

    return (
        <div className="container">
            <Row>
                {test.questions.length > 0 ?
                    //render test questions
                    (<h1>test questions</h1>)
                    :
                    //test has no question. need to choose from existing questions.
                    questions.map(
                        (q, questionIndex) => q.answers.map(({ content, correct, }, answerIndex) =>
                            <QuestionAnswer
                                key={answerIndex}
                                questionType={q.type}
                                content={content}
                                answerIndex={answerIndex}
                                mode={{ isEditMode: true, onContentChange: e => onContentChange(e, answerIndex, questionIndex) }}
                                selected={correct}
                                onSelectionChange={e => onSelectionChanged(e, answerIndex, questionIndex)}
                            />
                        ))}
            </Row>
        </div>
    )
}