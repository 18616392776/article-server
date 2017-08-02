import { Request } from 'express';

export function getBody(request: Request): Promise<string> {
    let body = '';
    return new Promise<string>(resolve => {
        request.on('data', chunk => {
            body += chunk;
        });
        request.on('end', () => {
            resolve(body);
        });
    });
}