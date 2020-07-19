class HTTPStatusCodes {
    static get SuccessRequestCode() { return 200; }

    static get CreatedRequestCode() { return 201; }
    
    static get NoContentCode() { return 204; }

    static get BadRequestCode() { return 400; }

    static get UnauthorizedRequestCode() { return 401; }
    
    static get ForbiddenCode() { return 403; }

    static get NotFoundCode() { return 404; }

    static get InternalServerErrorCode() { return 500; }
}
module.exports = HTTPStatusCodes;
