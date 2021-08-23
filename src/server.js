const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const https = require('https');
const fs = require('fs');

dotenv.config();
// local
const apiRouter = require( './api/index.js' );

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

app.use( (req, res, next) => {
  const requester = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  logger.info( `REQUEST: ${ requester } ${ req.method.toUpperCase() } ${ req.originalUrl }` );
  
  res.writejson = res.json;
  res.json = (...params) => {
      logger.info( `RESPONSE FOR: ${ requester } ${ req.method.toUpperCase() } ${ req.originalUrl } ` );
      logger.info( `RESPONSE: `+ JSON.stringify( params[0] ) );
      res.writejson( ...params );
  };
  next();
});

app.use( `/api`, apiRouter );

app.use((rq, rsp)=>{
    rsp.status(404).json({
        errCode: 404,
        errMessage: `Requested url is not found`,
        data: {}
    })
})

module.exports = {
  startServer(){
  //     const options = {
  //         key: fs.readFileSync( path.join( path.resolve(), `secret`, `key.pem` ) ),
  //         cert: fs.readFileSync( path.join( path.resolve(), `secret`, `cert.pem` ) ),
  //         requestCert: false,
  //         rejectUnauthorized: false
  //     }
    
  //     http.createServer(app).listen(PORT);
    http.createServer(app).listen();
  //     https.createServer(options, app).listen(HTTPS_PORT);
  }
}
