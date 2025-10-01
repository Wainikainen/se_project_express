const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const CONFLICT_ERROR = 409;
const UNAUTH_ERROR = 401;
const FORBIDDEN_ERROR = 403;

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.code = 500;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.code = 409;
  }
}

class UnauthError extends Error {
  constructor(message) {
    super(message);
    this.code = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.code = 403;
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const { code = 500, message } = err;
  res.status(code).send({
    message: code === 500 ? "An error in server!" : message,
  });
};

module.exports = {
  BadRequest,
  NotFound,
  ServerError,
  ConflictError,
  UnauthError,
  ForbiddenError,
  errorHandler,
};
