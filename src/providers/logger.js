const {transports, createLogger, format} = require('winston');
const fs = require(`fs`);
const path = require(`path`);

const logsPath = path.join( path.resolve(), `logs/` );
if ( !(fs.existsSync( logsPath ) ) ) 
    fs.mkdirSync(logsPath);


const fileName = `${logsPath}/${Date.now()}_main.log`;
fs.createWriteStream( fileName );


const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({filename: fileName })
    ]
});
module.exports = logger;
