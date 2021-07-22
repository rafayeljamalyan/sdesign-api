/** created by r
 *  02-03-21
 *  17:11
 */

// dependencies
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
// eslint-disable-next-line no-undef
const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } = process.env;

export const database = DB_NAME || `sdesign`;

// local
const db_config = {
    host: DB_HOST || "localhost",
    port: 3306,
    user: DB_USER || "root",
    password: DB_PASSWORD || "",
    database: database,
    ssl: false,
    dateStrings: true
};

export const db = mysql.createPool(db_config);
db.format = mysql.createConnection(db_config).format;
