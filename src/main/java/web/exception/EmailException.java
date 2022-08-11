package web.exception;



import java.util.regex.Pattern;

public class EmailException extends RuntimeException{


    public EmailException() {
        super("User email can't be null!");
    }

    public EmailException(String email) {
        super(String.format("User email '%s' already exist!", email));
    }
    public EmailException(boolean b) {
        super("Bad email");
    }

}
