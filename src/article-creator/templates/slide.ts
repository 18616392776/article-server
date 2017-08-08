import { SlideType } from '../help-types';

export function slideParser(source: SlideType): string {
    let slideItems: Array<string> = [];

    source.config.slideItems.forEach(item => {
        let str = `
            <ui-slide-item style="background-image: url(${item.src})">
                <a href="${item.link || 'javascript'}" target="${item.target}">
                </a> 
            </ui-slide-item>
        `;
        slideItems.push(str);
    });

    return `
        <ui-slide style="padding-bottom: ${source.config.height / source.config.width * 100}%">
        ${slideItems.join('')}
        </ui-slide>
    `;
}

