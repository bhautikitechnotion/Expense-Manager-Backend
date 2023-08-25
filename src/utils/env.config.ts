import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

interface Config {
    serverPort: string | undefined;
}

const envSettings: Config = {
    serverPort: process.env.SERVER_PORT
};

export { envSettings }