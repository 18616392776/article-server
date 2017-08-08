import { MarkdownType, EmptyType, SlideType } from './help-types';
import { slideParser } from './templates/slide';

export function templateToXML(content: Array<MarkdownType | EmptyType | SlideType>): string {
    let result: Array<string> = [];
    content.forEach(item => {
        switch (item.type) {
            case 'markdown':
                const html = `<div class="container-fluid">${item.value.replace(/([{}])/g, '{{\'$1\'}}')}</div>`;
                result.push(html);
                break;
            case 'slide':
                result.push(slideParser(item));
                break;
        }
    });
    return result.join('');
}