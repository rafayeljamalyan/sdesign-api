const dotenv = require(`dotenv`);
dotenv.config();
const server = require('./server.js');

server.startServer();
