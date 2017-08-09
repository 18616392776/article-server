import { connection } from '../connection';
import { listChildrenKeyToCamelCase } from '../utils/to-camel-case';

export interface DBArticleType {
    id?: number;            // 主键，自增id
    title?: string;         // 文章标题
    content?: string;       // 文章内容
    createTime?: Date;      // 创建时间
    updateTime?: Date;      // 更新时间
    createUser?: number;    // 创建用户
    updateUser?: number;    // 更新用户
    readCount?: number;     // 读取次数
    keywords?: string;      // 关键字
    delete?: boolean;       // 是否删除
    cwd?: string;           // 储存路径
    url?: string;           // 访问路由
}

export class DBArticle {
    get(id: number) {
        return new Promise<DBArticleType>((resolve, reject) => {
            connection.query(`select * from article where id=${id}`, (error, result) => {
                if (error) {
                    reject(error);
                    throw error;
                }
                resolve(listChildrenKeyToCamelCase(result)[0] || {});
            });
        });
    }

    getList(currentPage: number, pageSize: number) {
        return new Promise<any>((resolve, reject) => {
            connection.query('select count(*) from article', (error, result) => {
                const rows = result[0]['count(*)'];
                if (error) {
                    reject(error);
                    throw error;
                }
                let pages = Math.ceil(rows / pageSize);
                if (currentPage > pages) {
                    currentPage = pages;
                }
                if (currentPage < 1) {
                    currentPage = 1;
                }
                resolve({
                    total: rows,
                    currentPage: currentPage,
                    pageSize,
                    pages
                });
            });
        }).then(result => {
            return new Promise<DBArticleType>((resolve, reject) => {
                if (result.total === 0) {
                    result.dataList = [];
                    resolve(result);
                }
                const start = (result.currentPage - 1) * result.pageSize;
                const sql = `select title, id, url from article limit ${start}, ${start + result.pageSize}`;
                connection.query(sql, (error, rows) => {
                    if (error) {
                        reject(error);
                        throw error;
                    }
                    result.dataList = listChildrenKeyToCamelCase(rows);
                    resolve(result);
                });
            });
        });
    }

    add(article: any) {
        return new Promise<string>((resolve, reject) => {
            const keys = [
                'title',
                'content',
                'create_time',
                'create_user',
                'url',
                'cwd'
            ].join(',');
            const values = [
                article.title,
                article.content,
                article.createTime,
                article.createUser,
                article.url,
                article.cwd
            ];
            const sql = `insert into article(${keys}) values(?, ?, ? ,?, ?, ?)`;
            connection.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                    throw error;
                }
                resolve(result.insertId);
            });
        });
    }

    update(id: number, article: any) {
        return new Promise<void>((resolve, reject) => {
            const keys = [
                'title = ?',
                'content = ?',
                'update_time = ?',
                'update_user = ?',
                'url = ?',
                'cwd = ?'
            ].join(',');
            const values = [
                article.title,
                article.content,
                article.updateTime,
                article.updateUser,
                article.url,
                article.cwd
            ];

            const sql = `update article set ${keys} where id = ${id}`;
            connection.query(sql, values, (error) => {
                if (error) {
                    reject(error);
                    throw error;
                }
                resolve();
            });
        });
    }
}
