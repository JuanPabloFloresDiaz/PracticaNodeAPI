// result.js

/**
 * This module exports a function to create a standardized JSON response object.
 * The response object contains the following fields:
 * 
 * @param {number} status - The status code of the response (e.g., 0 for success, 1 for error).
 * @param {string|null} message - A message describing the result of the operation.
 * @param {object|null} dataset - The data returned by the operation, if any.
 * @param {string|null} error - A short description of the error, if any.
 * @param {string|null} exception - Detailed exception message, if any.
 * @param {string|null} fileStatus - The status of any file operations, if applicable.
 * @param {string|null} token - A token for authentication or other purposes, if applicable.
 * @param {object|null} additionalInfo - Any additional information that might be relevant.
 * 
 * @returns {object} The standardized response object.
 */
function createResult({
    status = 0,
    message = null,
    dataset = null,
    error = null,
    exception = null,
    fileStatus = null,
    token = null,
    additionalInfo = null
} = {}) {
    return {
        status,
        message,
        dataset,
        error,
        exception,
        fileStatus,
        token,
        additionalInfo
    };
}

module.exports = createResult;