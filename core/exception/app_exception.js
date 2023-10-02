class AppException extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode || 500;
	}
}

class NotFoundException extends AppException {
	constructor(message) {
		super(message, 404);
	}
}

class BadRequestException extends AppException {
	constructor(message) {
		super(message, 400);
	}
}

class UnauthorizedException extends AppException {
	constructor(message) {
		super(message, 401);
	}
}

class ConflictException extends AppException {
	constructor(message) {
		super(message, 409);
	}
}

class MethodNotAllowedException extends AppException {
	constructor(message) {
		super(message, 405);
	}
}

module.exports = {
	AppException,
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
  ConflictException,
  MethodNotAllowedException,
};
