import { Request, Response } from 'express';

import { DBArticle } from '../../data-base/index';
import { responseHeaders } from '../utils/response-headers';
import { getBody } from '../utils/request-body';
import { compile } from '../../article-creator/write-article';

const dbArticle = new DBArticle();

// 发布文章
export function publish(request: Request, response: Response) {
    getBody(request).then(bodyText => {
        const result = JSON.parse(bodyText);
        if (result.hasOwnProperty('id')) {
            return dbArticle.get(result.id).then(article => {
                // 编译文章
                return compile(result.title, result.content, article.cwd);
            }).then(articleInfo => {
                // 把文章更新信息存入数据库
                return dbArticle.update(result.id, {
                    title: result.title,
                    content: JSON.stringify(result.content),
                    updateTime: new Date(),
                    updateUser: 2,
                    url: articleInfo.url,
                    cwd: articleInfo.cwd
                }).then(() => {
                    return {
                        url: articleInfo.url,
                        id: result.id
                    };
                });
            });
        } else {
            // 编译文章
            return compile(result.title, result.content).then(articleInfo => {
                // 把文章信息存入数据库
                return dbArticle.add({
                    title: result.title,
                    content: JSON.stringify(result.content),
                    createUser: 1,
                    createTime: new Date(),
                    url: articleInfo.url,
                    cwd: articleInfo.cwd
                }).then(id => {
                    return {
                        url: articleInfo.url,
                        id
                    };
                });
            });
        }
    }).then((result: any) => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            data: result,
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

// 更新文章
export function update(request: Request, response: Response) {
    getBody(request).then(bodyText => {
        const result = JSON.parse(bodyText);
        dbArticle.update(result.id, {
            title: result.title,
            content: JSON.stringify(result.content),
            updateTime: new Date(),
            // TODO 用户相关业务未实现
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

// 通过id获取文章
export function get(request: Request, response: Response) {
    const query = request.query;

    dbArticle.get(query.id).then(result => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            data: {
                title: result.title,
                content: JSON.parse(result.content),
                id: query.id
            },
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

// 获取文章列表
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

// 添加文章
export function add(request: Request, response: Response) {
    getBody(request).then(bodyText => {
        const result: any = JSON.parse(bodyText);
        dbArticle.add({
            title: result.title,
            content: JSON.stringify(result.content),
            // TODO 用户相关业务未实现
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