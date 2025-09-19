package com.CODEWITHRISHU.CraftAI_Connect.exception;

public class UserAlreadyExists extends RuntimeException {
    public UserAlreadyExists(String message) {
        super(message);
    }
}