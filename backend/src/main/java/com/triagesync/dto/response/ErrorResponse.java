
package com.triagesync.dto.response;

import com.triagesync.enums.ErrorCode;

public record ErrorResponse(
        ErrorDetail error
) {

    public record ErrorDetail(
            String code,
            String message
    ) {
    }

    public ErrorResponse(ErrorCode code, String message) {
        this(
                new ErrorDetail(
                        code.name(),
                        message
                )
        );
    }
}
