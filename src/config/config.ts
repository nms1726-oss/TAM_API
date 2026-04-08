import dotenv from 'dotenv';
dotenv.config();

const config = {
    db: {
        host: "localhost",
        user: "root",
        database: process.env.DATABASE || "tam",
    },
    port: 3000,
    listPerPage: 100
};
export default config;