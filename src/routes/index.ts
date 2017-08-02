import * as express from 'express';
import { upload } from './api/image';
import { getList, add, get, update, publish } from './api/article';

export function useApi(app: express.Application) {
    app.post('/image/upload', upload);
    app.get('/article/get-list', getList);
    app.post('/article/add', add);
    app.get('/article/get', get);
    app.post('/article/update', update);
    app.post('/article/publish', publish);
}