import { createConnection } from 'mysql';

export const connection = createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'tb001373',
    database: 'db_content'
});

connection.connect();

process.on('exit', (code) => {
    console.log('node 服务已停止：code: ' + code);
    connection.end();
    console.log('已断开数据库连接！');
});