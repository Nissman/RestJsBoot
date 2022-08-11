package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import web.model.User;
import web.service.RoleService;
import web.service.UserService;


@Controller
public class AdminController {

    private final UserService userService;

    private final RoleService roleService;

    @Autowired
    private AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }



    @GetMapping(value = "/admin/addUser")
    public String createUserForm(User userNew, @AuthenticationPrincipal User user, ModelMap model) {
        model.addAttribute("user", user);
        model.addAttribute("userNew", userNew);
        model.addAttribute("roles", roleService.findAll());
        return "admin/addUser";
    }

    @PostMapping(value = "/addUser")
    public String createUser(User userNew) {
        userService.save(userNew);
        return "redirect:/admin";
    }

    @PostMapping(value = "/admin/user-update/{id}")
    public String update(@ModelAttribute("user") User user, ModelMap model) {
        userService.edit(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/admin/user-delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }
}
