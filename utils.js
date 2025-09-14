const winston = require('winston');

function validateFields(sourceObj, requiredFields) {
  const missingFields = [];

  for (const field of requiredFields) {
    if (!(sourceObj && Object.prototype.hasOwnProperty.call(sourceObj, field))) {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console()
  ]
});


function logInfo(message, meta = {}) {
  logger.info(message, meta);
}

function logError(message, meta = {}) {
  logger.error(message, meta);
}



module.exports = {
  validateFields,
  logInfo,
  logError
};
