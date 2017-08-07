import { SlideType } from '../help-types';

export function slideParser(source: SlideType): string {
    let slideItems: Array<string> = [];

    source.config.slideItems.forEach(item => {
        let str = `
            <ui-slide-item>
                <a href="${item.link || 'javascript'}" target="${item.target}">
                    <img src="${item.src}">
                </a> 
            </ui-slide-item>
        `;
        slideItems.push(str);
    });

    return `
        <ui-slide style="width: ${source.config.width}px; height: ${source.config.width}px">
        ${slideItems.join('')}
        </ui-slide>
    `;
}

