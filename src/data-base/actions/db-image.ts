import { connection } from '../connection';
import { listChildrenKeyToCamelCase } from '../utils/to-camel-case';

export interface DBImageType {
    id?: number;            // 主键，自增id
    createTime?: Date;      // 创建时间
    createUser?: number;    // 创建时间
    cwd?: string;           // 储存路径
    url?: string;           // 访问url
    name?: string;          // 图片名字
    rawName?: string;       // 图片原始名字
}

export class DBImage {
    add(filename: string, cwd: string, url: string, rawName: string) {
        return new Promise<void>((resolve, reject) => {
            const keys = ['create_user', 'create_time', 'url', 'cwd', 'raw_name', 'name'].join(',');

            const values = [1, new Date(), url, filename, rawName, rawName];

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
