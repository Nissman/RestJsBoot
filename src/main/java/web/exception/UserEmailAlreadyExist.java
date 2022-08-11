package web.exception;

public class UserEmailAlreadyExist extends RuntimeException{

    public UserEmailAlreadyExist(String email) {
        super(String.format("User email '%s' already exist!", email));
    }
}
