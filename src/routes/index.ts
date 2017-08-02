import * as express from 'express';
import { imageUpload } from './api/upload-image';
import { getArticles, addArticle, getArticle, updateArticle } from './api/article';

export function useApi(app: express.Application) {
    app.post('/upload', imageUpload);
    app.get('/get-articles', getArticles);
    app.post('/add-article', addArticle);
    app.get('/get-article', getArticle);
    app.post('/update-article', updateArticle);
}