/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 *
 *  Helper class for logging messages of the plugin
 */

class Logger {
  constructor(loggerLevel) {
    this.loggerLevel = loggerLevel;
    this.levels = ['verbose', 'debug', 'info', 'warning', 'error', 'none'];
  }

  shouldLog(logLevel) {
    return this.levels.indexOf(logLevel) >= this.levels.indexOf(this.loggerLevel);
  }

  debug(message) {
    this.printMessage('debug', message);
  }

  verbose(message) {
    this.printMessage('verbose', message);
  }

  info(message) {
    this.printMessage('info', message);
  }

  warning(message) {
    this.printMessage('warning', message);
  }

  error(message) {
    this.printMessage('error', message);
  }

  /**
   * Format and print message on console
   * @param {level} the logging level of message.
   * @param {message} the message to log.
   */
  printMessage(level, message) {
    // Filter messages by level
    if (!this.shouldLog(level)) return;

    // Format the message
    var formattedMessage = `Vuex WebExtensions ${level}: ${message}`;

    if (level == 'error') {
      console.error(formattedMessage);
    } else if (level == 'warning') {
      console.warn(formattedMessage);
    } else if (level == 'info') {
      console.info(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
}

export default Logger;
