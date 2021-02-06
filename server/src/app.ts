import express, { Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { json } from 'body-parser';
import { appLoggerService } from './services';
import { patchRouterParamForAsyncHandling } from './utils';
import { questionsRoutes, authRoutes, testRoutes, reportRoutes, examRoutes } from './routes';
import { constants } from '@yahalom-tests/common';
import { assignId, authMiddleware, errorMiddleware, notFoundMiddleware } from './middleware';
import 'reflect-metadata';

morgan.token('id', function getId(req: Request) {
    return req.id;
});

patchRouterParamForAsyncHandling();
const app = express();

app.use(assignId);
app.use(helmet());
app.use(cors());
app.use(
    morgan(':id :method :url :status :response-time ms - :res[content-length]', {
        stream: new appLoggerService.LogStream(),
    })
);
app.use(json());
app.use(compression());

app.use('/questions', authMiddleware, questionsRoutes);
app.use('/auth', authRoutes);
app.use('/tests', authMiddleware, testRoutes);
app.use('/reports', authMiddleware, reportRoutes);
app.use('/exam', examRoutes);
app.use('*', notFoundMiddleware);
app.use(errorMiddleware);

const { serverDomain, serverPort } = constants.URLS;

app.listen(serverPort, () =>
    appLoggerService.debug(`YahalomTests server is running at ${serverDomain}:${serverPort}`)
);
