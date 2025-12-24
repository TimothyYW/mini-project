import "dotenv/config";

export const PORT = process.env.PORT;

export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;

export const BASE_URL_FE = process.env.BASE_URL_FE || "http://localhost:3000";
export const JWT_SECRET = process.env.JWT_SECRET