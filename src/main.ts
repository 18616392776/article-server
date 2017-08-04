import * as express from 'express';

import { PORT, IP, STATIC_PATH } from './global-config';
import { useApi } from './routes/index';

const app = express();

app.use(express.static(STATIC_PATH));

useApi(app);

app.listen(PORT, IP, (error: any) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('http://' + IP + ':' + PORT);
});