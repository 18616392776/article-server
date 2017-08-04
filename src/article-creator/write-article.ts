import { writeFile } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { copy } from 'fs-extra';

import { STATIC_PATH, HOST, PORT } from '../global-config';
import { templateToXML } from './template-parser';
import { MarkdownType, EmptyType, SlideType } from './help-types';

export function compile(title: string, content: Array<MarkdownType | EmptyType | SlideType>) {
    return new Promise<string>((resolve, reject) => {
        const fileName = join(__dirname, '../../article-source-template/src/views/app.html');
        const result = templateToXML(content);
        writeFile(fileName, result, (error => {
            if (error) {
                reject(error);
            }

            let child = spawn('npm run build', [], {
                stdio: 'inherit',
                cwd: 'article-source-template/',
                shell: true
            });
            child.on('error', (error) => {
                reject(error);
            });
            child.on('close', (data) => {

                const folderName = 'article/' + Math.ceil(Math.random() * 10000).toString(36) + '/';
                copy('article-source-template/dist', STATIC_PATH + folderName).then(() => {
                    const url = `${HOST}:${PORT}/${folderName}index.html`;
                    resolve(url);
                }).catch(() => {
                    reject(new Error('复制文章失败！'));
                });
            });
        }));
    });
}