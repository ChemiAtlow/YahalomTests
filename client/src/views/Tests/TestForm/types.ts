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

export type TestDetailsError = Record<
    keyof Omit<TestDetailsKeys, 'language' | 'isReviewEnabled'> | 'general',
    string
>;
export type TestEmailError = Record<keyof models.dtos.EmailDto, string>;
export type TestMessagesError = Record<
    keyof Omit<TestMessagesKeys, 'successEmail' | 'failureEmail'> | 'general',
    string
> & { successEmail: TestEmailError; failureEmail: TestEmailError };
