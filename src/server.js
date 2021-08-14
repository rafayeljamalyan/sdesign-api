import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import fs from 'fs';

dotenv.config();
// local
import apiRouter from './api/index.js';

const app = express();

app.use('/public',express.static('./public/files'))

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( cors() );
// eslint-disable-next-line no-undef
app.use( express.static( path.join( path.resolve( path.dirname('') ),  `public` ) ) );
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3007;
// eslint-disable-next-line no-undef
const HTTPS_PORT = process.env.HTTPS_PORT || 3018;

app.use( `/api`, apiRouter );

app.use((rq, rsp)=>{
    rsp.status(404).json({
        errCode: 404,
        errMessage: `Requested url is not found`,
        data: {}
    })
})

export function startServer(){
    const options = {
        key: fs.readFileSync( path.join( path.resolve(), `secret`, `key.pem` ) ),
        cert: fs.readFileSync( path.join( path.resolve(), `secret`, `cert.pem` ) )
    }
    
    http.createServer(app).listen(PORT);
    https.createServer(options, app).listen(HTTPS_PORT);
}
