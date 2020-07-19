class ResponseMessage {
    static createSuccessMessage(message) {
        return ({
            success: true,
            message,
        });
    }

    static createErrorMessage(message) {
        return ({
            error: true,
            message,
        });
    }

    static createInternalErrorMessage() {
        return ({
            error: true,
            message: 'Something went wrong',
        });
    }
}

module.exports = ResponseMessage;
