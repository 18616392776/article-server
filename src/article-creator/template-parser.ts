import { MarkdownType, EmptyType, SlideType } from './help-types';
import { slideParser } from './templates/slide';

export function templateToXML(content: Array<MarkdownType | EmptyType | SlideType>): string {
    let result: Array<string> = [];
    content.forEach(item => {
        switch (item.type) {
            case 'markdown':
                result.push(item.value);
                break;
            case 'slide':
                result.push(slideParser(item));
                break;
        }
    });
    return result.join('');
}