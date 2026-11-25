
package com.triagesync.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 254, message = "Email must be at most 254 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Size(
                min = 8,
                max = 64,
                message = "Password must be between 8 and 64 characters"
        )
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Password must contain at least 1 letter and 1 digit"
        )
        String password,

        @Size(
                min = 2,
                max = 50,
                message = "Name must be between 2 and 50 characters"
        )
        String name

) {

    // Normalize email and name
    public AuthRequest {
        if (email != null) {
            email = email.trim().toLowerCase();
        }

        if (name != null) {
            name = name.trim();
        }
    }

    // Login request
    public static AuthRequest ofLogin(
            String email,
            String password
    ) {
        return new AuthRequest(email, password, null);
    }

    // Registration request
    public static AuthRequest ofRegister(
            String name,
            String email,
            String password
    ) {
        return new AuthRequest(email, password, name);
    }
}
