const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Log level (info, error, warn, debug, etc.)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add a timestamp
    format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
    ) // Format the log message
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Error logs
    new transports.File({ filename: 'logs/combined.log' }), // All logs
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize output for better readability
        format.simple()
      ),
    })
  );
}

module.exports = logger;