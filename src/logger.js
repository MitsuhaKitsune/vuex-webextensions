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
   * @param {string} level - The logging level of message.
   * @param {string} message - The message to log.
   * @returns {null} This function didn't return any value
   */
  printMessage(level, message) {
    // Filter messages by level
    if (!this.shouldLog(level)) {
      return;
    }

    // Format the message
    var formattedMessage = `Vuex WebExtensions ${level}: ${message}`;

    if (level == 'error') {
      // eslint-disable-next-line no-console
      console.error(formattedMessage);
    } else if (level == 'warning') {
      // eslint-disable-next-line no-console
      console.warn(formattedMessage);
    } else if (level == 'info') {
      // eslint-disable-next-line no-console
      console.info(formattedMessage);
    } else {
      // eslint-disable-next-line no-console
      console.log(formattedMessage);
    }
  }
}

export default Logger;
