import { models } from '@yahalom-tests/common';

export type QuestionDetailsKeys = Pick<
    models.interfaces.Question,
    'type' | 'alignment' | 'title' | 'label' | 'additionalContent'
>;
export type QuestionDetailsErrors = Record<
    keyof Omit<QuestionDetailsKeys, 'type' | 'alignment' | 'additionalContent'> | 'general',
    string
>;

export type QuestionAnswersKeys = Pick<models.interfaces.Question, 'type' | 'answers'>;
