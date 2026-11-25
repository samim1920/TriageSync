
package com.triagesync.exception;

import com.triagesync.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class ConflictException extends ApiException {

    public ConflictException(String message) {
        super(
                HttpStatus.CONFLICT,
                ErrorCode.CONFLICT,
                message
        );
    }
}
