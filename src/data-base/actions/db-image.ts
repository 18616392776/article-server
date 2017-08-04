import { connection } from '../connection';
import { listChildrenKeyToCamelCase } from '../utils/to-camel-case';

export class DBImage {
    add(filename: string, cwd: string, rawName: string) {
        return new Promise<any>((resolve, reject) => {
            const keys = ['create_user', 'create_time', 'url', 'cwd', 'raw_name', 'name'].join(',');

            const values = [1, new Date(), filename, cwd, rawName, rawName];

            const sql = `insert into image(${keys}) values(?, ?, ?, ?, ?, ?)`;
            connection.query(sql, values, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    getList(currentPage: number, pageSize: number) {
        return new Promise<any>((resolve, reject) => {
            connection.query('select count(*) from image', (error, result) => {
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
                const sql = `select name, raw_name, url from image limit ${start}, ${start + result.pageSize}`;
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
}
