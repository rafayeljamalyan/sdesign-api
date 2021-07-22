import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
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

app.use( `/api`, apiRouter );

app.use((rq, rsp)=>{
    rsp.status(404).json({
        errCode: 404,
        errMessage: `Requested url is not found`,
        data: {}
    })
})

export function startServer(){
    app.listen( PORT, (err) => {
        console.log( err );
        console.log(`Server started listening on port ${PORT}`);
    })
}
