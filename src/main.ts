import * as express from 'express';

import { PORT, IP, IMG_FOLDER } from './global-config';
import { useApi } from './routes/index';

const app = express();

app.use(express.static(IMG_FOLDER));

useApi(app);

app.listen(PORT, IP, (error: any) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('http://' + IP + ':' + PORT);
});