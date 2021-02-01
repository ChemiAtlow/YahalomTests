import { models } from '@yahalom-tests/common';

export type TestDetailsKeys = Pick<
    models.dtos.TestDto,
    'language' | 'intro' | 'minPassGrade' | 'title' | 'isReviewEnabled'
>;
export type TestMessagesKeys = Pick<
    models.dtos.TestDto,
    'failureEmail' | 'successEmail' | 'failureMessage' | 'successMessage'
>;

export type TestQuestionsKeys = Pick<models.dtos.TestDto, 'questions'>;
