const {transports, createLogger, format} = require('winston');
const fs = require(`fs`);

if ( !(fs.existsSync(`logs/`) ) ) 
    fs.mkdirSync(`logs/`);


const fileName = `logs/${Date.now()}_main.log`;
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
