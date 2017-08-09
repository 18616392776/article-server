import { writeFile } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { copy } from 'fs-extra';

import { STATIC_PATH, HOST, PORT, ARTICLE_PATH } from '../global-config';
import { templateToXML } from './template-parser';
import { MarkdownType, EmptyType, SlideType } from './help-types';

export function compile(title: string, content: Array<MarkdownType | EmptyType | SlideType>, cwd?: string) {
    return new Promise<any>((resolve, reject) => {
        const fileName = join(__dirname, '../../article-source-template/src/views/app.html');
        const result = templateToXML(content);
        writeFile(fileName, result, (error => {
            if (error) {
                reject(error);
            }

            process.env.title = title;

            let child = spawn('npm run build', [], {
                stdio: 'inherit',
                cwd: 'article-source-template/',
                shell: true,
                env: process.env
            });
            child.on('error', (error) => {
                reject(error);
            });
            child.on('close', (data) => {

                if (data !== 0) {
                    reject(new Error('文章发布失败，子进程错误代码`' + data + '`！'));
                    return;
                }
                if (!cwd) {
                    cwd = ARTICLE_PATH + Math.ceil(Math.random() * 10000).toString(36) + '/';
                }
                const targetPath = STATIC_PATH + cwd;
                copy('article-source-template/dist', targetPath).then(() => {
                    const url = `${HOST}:${PORT}/${cwd}index.html`;
                    console.log(`文章发布成功，发布地址：${url}`);
                    resolve({
                        url,
                        cwd
                    });
                }).catch(() => {
                    reject(new Error('复制文章失败！'));
                });
            });
        }));
    });
}