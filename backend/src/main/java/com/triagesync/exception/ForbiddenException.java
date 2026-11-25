
package com.triagesync.exception;

import com.triagesync.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApiException {

    public ForbiddenException(String message) {
        super(
                HttpStatus.FORBIDDEN,
                ErrorCode.FORBIDDEN,
                message
        );
    }
}
