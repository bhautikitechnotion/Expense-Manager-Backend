import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

interface Config {
    serverPort: string | undefined;
    uri: string | undefined;
    db: string | undefined;
    userTokenSecretKey: string | undefined;
}

const envSettings: Config = {
    serverPort: process.env.SERVER_PORT,
    uri: process.env.MONGO_CONNECTION_URL,
    db: process.env.MONGO_DB,
    userTokenSecretKey: process.env.USER_TOKEN_SECRET_KEY
};

export { envSettings }