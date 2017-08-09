import { address } from 'ip';

export const PORT = 2222;                           // 启动端口号
export const IP = address();                        // 本地ip
export const HOST = 'http://' + IP;                 // 服务器域名
export const STATIC_PATH = './public/';             // 上传文件储存文件夹，如要更改，请先在项目根目录下，建好相关文件夹
export const IMAGE_LIBRARIES_PATH = 'images-lib/';  // 上传图片在`STATIC_PATH`下的文件夹
export const ARTICLE_PATH = 'images-lib/';          // 编译后文章在`STATIC_PATH`下的文件夹
