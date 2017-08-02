import { createConnection } from 'mysql';

export const connection = createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'tb001373',
    database: 'db_content'
});