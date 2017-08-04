import * as express from 'express';
import { upload, getList as getImageList } from './api/image';
import { getList as getArticleList, add, get, update, publish } from './api/article';

export function useApi(app: express.Application) {
    // 图片相关接口
    app.post('/image/upload', upload);
    app.get('/image/get-list', getImageList);

    // 文章相关接口
    app.get('/article/get-list', getArticleList);
    app.post('/article/add', add);
    app.get('/article/get', get);
    app.post('/article/update', update);
    app.post('/article/publish', publish);
}