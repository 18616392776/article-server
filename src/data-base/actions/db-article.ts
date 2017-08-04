import { connection } from '../connection';
import { listChildrenKeyToCamelCase } from '../utils/to-camel-case';

export class DBArticle {
    get(id: number) {
        return new Promise<any>((resolve, reject) => {
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
            return new Promise<any>((resolve, reject) => {
                if (result.total === 0) {
                    result.dataList = [];
                    resolve(result);
                }
                const start = (result.currentPage - 1) * result.pageSize;
                const sql = `select title, id from article limit ${start}, ${start + result.pageSize}`;
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
        return new Promise<void>((resolve, reject) => {
            const keys = ['title', 'content', 'create_time', 'create_user'].join(',');
            const values = [article.title, article.content, article.createTime, article.createUser];

            const sql = `insert into article(${keys}) values(?, ?, ? ,?)`;
            connection.query(sql, values, (error) => {
                if (error) {
                    reject(error);
                    throw error;
                }
                resolve();
            });
        });
    }

    update(id: number, article: any) {
        return new Promise<void>((resolve, reject) => {
            const keys = ['title = ?', 'content = ?', 'update_time = ?', 'update_user = ?'].join(',');
            const values = [article.title, article.content, article.updateTime, article.updateUser];

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
