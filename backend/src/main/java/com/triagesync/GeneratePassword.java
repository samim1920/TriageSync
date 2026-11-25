package com.triagesync;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePassword {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "{ADMIN_PASSWORD}";

        String encodedPassword =
                encoder.encode(password);

        System.out.println("BCrypt Password:");
        System.out.println(encodedPassword);

    }
}

