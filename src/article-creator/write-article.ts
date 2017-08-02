import { writeFile } from 'fs';
import { join } from 'path';
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
            resolve('文章url');
        }));
    });
}