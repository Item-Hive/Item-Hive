package za.ac.cput.branded.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Turns the exceptions thrown by UserService into proper HTTP responses,
 * so the frontend can tell "already registered" apart from a server crash.
 */
@RestControllerAdvice(assignableTypes = UserController.class)
public class UserExceptionHandler {

    // "An account with this email already exists", "...student number already exists", etc.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    // "Student number is required", "Invalid role", etc.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}