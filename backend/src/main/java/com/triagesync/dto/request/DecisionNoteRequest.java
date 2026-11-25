
package com.triagesync.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DecisionNoteRequest(

        @NotBlank(message = "Rejection note is required")
        @Size(
                min = 5,
                max = 200,
                message = "Rejection note must be between 5 and 200 characters"
        )
        String note

) {

    public DecisionNoteRequest {
        if (note != null) {
            note = note.trim();
        }
    }
}
