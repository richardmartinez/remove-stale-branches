/**
 * @description Used to trim a string. It is intented to be used to create a filter function for an inquirer prompt.
 * @returns {function}
 */
exports.createStringTrimFilter = () => {
  return string => string.trim();
}
