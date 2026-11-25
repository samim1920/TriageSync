
package com.triagesync.exception;

import com.triagesync.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final ErrorCode errorCode;

    public ApiException(
            HttpStatus httpStatus,
            ErrorCode errorCode,
            String message
    ) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }

    public static ApiException validation(String message) {
        return new ApiException(
                HttpStatus.BAD_REQUEST,
                ErrorCode.VALIDATION_ERROR,
                message
        );
    }

    public static ApiException unauthenticated(String message) {
        return new ApiException(
                HttpStatus.UNAUTHORIZED,
                ErrorCode.UNAUTHENTICATED,
                message
        );
    }

    public static ApiException forbidden(String message) {
        return new ApiException(
                HttpStatus.FORBIDDEN,
                ErrorCode.FORBIDDEN,
                message
        );
    }

    public static ApiException notFound(String message) {
        return new ApiException(
                HttpStatus.NOT_FOUND,
                ErrorCode.NOT_FOUND,
                message
        );
    }

    public static ApiException conflict(String message) {
        return new ApiException(
                HttpStatus.CONFLICT,
                ErrorCode.CONFLICT,
                message
        );
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
