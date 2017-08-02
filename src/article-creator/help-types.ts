export interface MarkdownType {
    type: 'markdown';
    rawValue: string;
    value: string;
}

export type LinkTarget = '_blank' | '_self' | '';

export interface SlideItem {
    src: string;
    target: LinkTarget;
    link: string;
}

export interface SlideConfig {
    width: number;
    height: number;
    slideItems: Array<SlideItem>;
}

export interface SlideType {
    type: 'slide';
    config: SlideConfig;
}

export interface EmptyType {
    type: 'empty';
}