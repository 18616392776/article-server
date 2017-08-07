import { address } from 'ip';

export const PORT = 2222;
export const IP = address();
export const HOST = 'http://' + IP;
export const STATIC_PATH = './public/';
export const IMAGE_LIBRARIES_PATH = 'images-lib/';
