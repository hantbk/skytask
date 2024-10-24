/**
 * Define a custom ApiError class that extends the built-in Error class
 * (This is necessary and considered a Best Practice since Error is a built-in class)
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    // Call the constructor of the Error class (the parent class) so that we can use `this`
    // The parent class (Error) already has a `message` property, so we'll pass it to `super` for simplicity
    super(message)

    // Set the name of this custom error; if not set, it will default to "Error"
    this.name = 'ApiError'

    // Assign the HTTP status code here
    this.statusCode = statusCode

    // Capture the stack trace to make debugging easier
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
