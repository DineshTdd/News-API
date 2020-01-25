const appRoot = require('app-root-path');
const winston = require('winston');
const {RedisLogSave} = require('../logs/logtransporter/redislogsave');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};


let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
      all:true
  }),
  winston.format.label({
      label:'[LOGGER]'
  }),
  winston.format.timestamp({
      format:"YYYY-MM-DD HH:MM:SS"
  }),
  winston.format.printf(
      info => {
        const formattedinfo = `{ "label": "${info.label}" , "timestamp": "${info.timestamp}" , "level": "${info.level}" , "message" : "${info.message.replace(/"/g, "")}" }`
        const formattedMsg = { "label": info.label , "timestamp": info.timestamp , "level": info.level , "message" : info.message }
        RedisLogSave(formattedMsg);
        return formattedinfo;
      }
  )
);

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File(options.file),
    // new winston.transports.Console(options.console)
    new (winston.transports.Console)({
      format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
  })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;