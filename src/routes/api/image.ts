import { Request, Response } from 'express';
import { Form, File } from 'multiparty';
import { rename, existsSync, mkdirSync } from 'fs';

import { DBImage } from '../../data-base/index';
import { STATIC_PATH, IMAGE_LIBRARIES_PATH } from '../../global-config';
import { responseHeaders } from '../utils/response-headers';
import { toDouble } from '../utils/to-double';

const dbImage = new DBImage();

export function getList(request: Request, response: Response) {
    const query = request.query;
    const currentPage = +query.currentPage || 1;
    const pageSize = +query.pageSize || 10;

    dbImage.getList(currentPage, pageSize).then((result: any) => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            data: result,
            message: '请求成功！'
        }));
    }, error => {
        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: false,
            data: null,
            message: error
        }));
    });
}

export function upload(request: Request, response: Response) {

    const date = new Date();
    let fileNamePrefix = date.getTime();
    const folderName = `${IMAGE_LIBRARIES_PATH}${date.getFullYear()}-${toDouble(date.getMonth() + 1)}-${toDouble(date.getDate())}/`;
    const path = STATIC_PATH + folderName;
    if (!existsSync(path)) {
        mkdirSync(path);
        console.log('创建目录：' + path);
    }

    const form = new Form({
        uploadDir: path
    });
    form.parse(request, (error, fields, files) => {
        const fileNames: Array<any> = [];
        // const filesTmp = JSON.stringify(files, null, 2);
        if (error) {
            console.log('文件解析出错: ' + error);
            response.writeHead(200, responseHeaders.json);
            response.end(JSON.stringify({
                success: false,
                message: '文件解析出错: ' + error,
                data: null
            }));
            return;
        }
        // console.log('上传文件信息: ' + filesTmp);

        files.fileName.forEach((item: File) => {
            const rawPath = item.path;
            const filePath = fileNamePrefix + item['originalFilename'].replace(/.*(?=\.\w+$)/, '');
            fileNamePrefix++;
            const newPath = path + filePath;
            fileNames.push({
                url: folderName + filePath,
                name: item['originalFilename'],
                rawName: item['originalFilename']
            });

            // 重命名为真实文件名
            rename(rawPath, newPath, (error: any) => {
                if (error) {
                    console.log('重命名失败: ' + error);
                    return;
                }
                dbImage.add(folderName + filePath, newPath, item['originalFilename']).then(() => {
                    console.log('图片信息存入数据库成功！');
                }, error => {
                    throw error;
                });
            });
        });

        response.writeHead(200, responseHeaders.json);
        response.end(JSON.stringify({
            success: true,
            message: '上传成功!',
            data: {
                dataList: fileNames
            }
        }));
    });
}