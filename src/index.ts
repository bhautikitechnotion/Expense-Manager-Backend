import express, { Application } from 'express';
import { envSettings } from '@src/utils/env.config';
import cors from 'cors';
import helmet from 'helmet';

if (!envSettings.serverPort) {
    process.exit(1);
}

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));



app.listen(envSettings.serverPort, () => {
    console.log(`Connecting to server at port ${envSettings.serverPort}`)
})