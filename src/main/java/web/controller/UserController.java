package web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    private UserController() {
    }

    @GetMapping(value = "/")
    public String redirectIndex() {
        return "redirect:login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping(value = "/index")
    public String userInfoForm() {
        return "index";
    }
}
