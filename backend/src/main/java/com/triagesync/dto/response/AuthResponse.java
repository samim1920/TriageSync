package com.triagesync.dto.response;

import com.triagesync.entity.User;
public record AuthResponse(
        String token,
        UserResponse user
) {
    public static AuthResponse of(String token, User user) {
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}