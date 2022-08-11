package web.controller;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import web.exception.EmailException;
import web.exception.UserNotFoundException;

@ControllerAdvice
public class ExceptionAdvice {

    @ResponseBody
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String userExceptionHandler(UserNotFoundException ex) {
        return ex.getMessage();
    }

    @ResponseBody
    @ExceptionHandler(EmailException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    String emailExceptionHandler(EmailException ex) {
        return ex.getMessage();
    }
}
