import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

interface Config {
    serverPort: string | undefined;
    uri: string | undefined;
    db: string | undefined;
}

const envSettings: Config = {
    serverPort: process.env.SERVER_PORT,
    uri: process.env.MONGO_CONNECTION_URL,
    db: process.env.MONGO_DB,
};

export { envSettings }