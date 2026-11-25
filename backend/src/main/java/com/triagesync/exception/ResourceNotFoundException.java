
package com.triagesync.exception;

import com.triagesync.enums.ErrorCode;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(
                HttpStatus.NOT_FOUND,
                ErrorCode.NOT_FOUND,
                message
        );
    }
}
