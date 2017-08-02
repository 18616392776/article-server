import { Request, Response } from 'express';

import { DBArticle } from '../../data-base/index';
import { responseHeaders } from '../utils/response-headers';
import { getBody } from '../utils/request-body';
import { compile } from '../../article-creator/write-article';

const dbArticle = new DBArticle();

export function publish(request: Request, response: Response) {
    getBody(request).then(bodyText => {
        const result = JSON.parse(bodyText);
        if (result.hasOwnProperty('id')) {
            return dbArticle.update(result.id, {
                title: result.title,
                content: JSON.stringify(result.content),
                updateTime: new Date(),
                updateUser: 2
            }).then(() => result);
        }
        return dbArticle.add({
            title: result.title,
            content: JSON.stringify(result.content),
            createUser: 1,
            createTime: new Date()
        }).then(() => result);

    }).then(result => {
        return compile(result.title, result.content);
    }).then((articleUrl: string) => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            data: {
                articleUrl
            },
            message: '文章保存成功！'
        }));
    }, error => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: false,
            data: null,
            message: error.toString()
        }));
    });
}

export function update(request: Request, response: Response) {
    getBody(request).then(bodyText => {
        const result = JSON.parse(bodyText);
        dbArticle.update(result.id, {
            title: result.title,
            content: JSON.stringify(result.content),
            updateTime: new Date(),
            updateUser: 2
        }).then(() => {
            response.writeHead(200, responseHeaders.json);
            response.end(JSON.stringify({
                success: true,
                data: null,
                message: '请求成功！'
            }));
        }, error => {
            response.writeHead(200, responseHeaders.json);
            response.end(JSON.stringify({
                success: false,
                data: null,
                message: error
            }));
        });
    });
}

export function get(request: Request, response: Response) {
    const query = request.query;

    dbArticle.get(query.id).then(result => {
        result.content = JSON.parse(result.content);
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            data: result,
            message: '请求成功！'
        }));
    }, error => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: false,
            data: null,
            message: error
        }));
    });
}

export function getList(request: Request, response: Response) {
    const query = request.query;
    const currentPage = +query.currentPage || 1;
    const pageSize = +query.pageSize || 10;

    dbArticle.getList(currentPage, pageSize).then((result: any) => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            data: result,
            message: '请求成功！'
        }));
    }, error => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: false,
            data: null,
            message: error
        }));
    });
}

export function add(request: Request, response: Response) {
    getBody(request).then(bodyText => {
        const result: any = JSON.parse(bodyText);
        dbArticle.add({
            title: result.title,
            content: result.content,
            createUser: 1,
            createTime: new Date()
        }).then(() => {
            response.writeHead(200, responseHeaders.json);
            response.end(JSON.stringify({
                success: true,
                data: null,
                message: '添加文章成功！'
            }));
        }, error => {
            response.writeHead(200, responseHeaders.json);
            response.end(JSON.stringify({
                success: false,
                data: null,
                message: error
            }));
        });
    });
}