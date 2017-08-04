import { Request, Response, NextFunction } from 'express';
import { Form, File } from 'multiparty';
import { rename, existsSync, mkdirSync } from 'fs';

import { STATIC_PATH } from '../../global-config';
import { responseHeaders } from '../utils/response-headers';
import { toDouble } from '../utils/to-double';


export function upload(request: Request, response: Response, next: NextFunction) {

    const date = new Date();
    const folderName = `${date.getFullYear()}-${toDouble(date.getMonth() + 1)}-${toDouble(date.getDate())}`;
    const path = STATIC_PATH + folderName + '/';
    console.log(path);
    if (!existsSync(path)) {
        mkdirSync(path);
        console.log('创建目录：' + path);
    }

    const form = new Form({
        uploadDir: path
    });
    form.parse(request, (error, fields, files) => {
        const fileNames: Array<string> = [];
        const filesTmp = JSON.stringify(files, null, 2);
        if (error) {
            console.log('parse error: ' + error);
        } else {
            console.log('parse files: ' + filesTmp);
            // const inputFile = files.fileName[0];
            files.fileName.forEach((item: File) => {
                const rawPath = item.path;
                const newPath = path + date.getTime() + item['originalFilename'].replace(/.*(?=\.\w+$)/, '');
                fileNames.push(newPath.replace(/^\./, ''));
                // 重命名为真实文件名
                rename(rawPath, newPath, (error: any) => {
                    if (error) {
                        console.log('rename error: ' + error);
                    } else {
                        console.log('rename ok');
                    }
                });
            });
        }
        response.writeHead(200, responseHeaders.json);
        // response.end(util.inspect({fields: fields, files: filesTmp}));
        response.end(JSON.stringify({
            success: true,
            message: '上传成功!',
            data: {
                imageUrls: fileNames
            }
        }));
    });
}