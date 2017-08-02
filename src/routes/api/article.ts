import { Request, Response } from 'express';

import { DBArticle } from '../../data-base/index';
import { responseHeaders } from '../utils/response-headers';

const dbArticle = new DBArticle();

export function publish() {

}

export function update(request: Request, response: Response) {
    let body = '';
    request.on('data', chunk => {
        body += chunk;
    });
    request.on('end', () => {
        const result = JSON.parse(body);
        dbArticle.updateArticle(result.id, {
            title: result.title,
            content: result.content,
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

    dbArticle.getArticle(query.id).then(result => {
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
    dbArticle.getArticles(+query.currentPage || 1, +query.pageSize || 10).then((result: any) => {
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
    let body = '';
    request.on('data', (chunk) => {
        body += chunk;
    });
    request.on('end', () => {
        const result: any = JSON.parse(body);
        dbArticle.addArticle({
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