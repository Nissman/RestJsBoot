package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.modelAssembler.RoleModelAssembler;
import web.modelAssembler.UserModelAssembler;
import web.service.RoleService;
import web.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;



@RestController
@CrossOrigin
public class RestControl {

    private final UserService userService;

    private final UserModelAssembler userAssembler;

    private final RoleModelAssembler roleAssembler;
    private final RoleService roleService;

    @Autowired
    public RestControl(UserService userService, UserModelAssembler userAssembler, RoleModelAssembler modelAssembler, RoleService roleService) {
        this.userService = userService;
        this.userAssembler = userAssembler;
        this.roleAssembler = modelAssembler;
        this.roleService = roleService;
    }

    @GetMapping("/api/getUser")
    public EntityModel<User> getUser(@AuthenticationPrincipal User user) {
       // User actualUser = userService.findByID(user.getId());

        return getUserByID(user.getId());
    }

    @GetMapping("/api/getUser/{id}")
    public EntityModel<User> getUserByID(@PathVariable Long id) {
        User user = userService.findByID(id);
        return userAssembler.toModel(user);
    }


    @GetMapping("/api/getUsers")
    public CollectionModel<EntityModel<User>> getUsers() {
        List<EntityModel<User>> users = userService.findAll().stream()
                .map(userAssembler::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(users, linkTo(methodOn(RestControl.class).getUsers()).withSelfRel());
    }

    @GetMapping("/api/getRole/{id}")
    public EntityModel<Role> getRoleByID(@PathVariable Long id) {
        Role role = roleService.findByID(id);
        return roleAssembler.toModel(role);
    }

    @GetMapping("/api/getRoles")
    public CollectionModel<EntityModel<Role>> getRoles() {
        List<EntityModel<Role>> roles = roleService.findAll().stream()
                .map(roleAssembler::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(roles, linkTo(methodOn(RestControl.class).getUsers()).withSelfRel());
    }

    @PostMapping("/api/create")
    ResponseEntity<?> createUser(@RequestBody User newUser) {
        EntityModel<User> entityModel = userAssembler.toModel(userService.save(newUser));
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    @PutMapping("/api/update/{id}")
    ResponseEntity<?> editUser(@RequestBody User editUser, @PathVariable Long id) {
        User updateUser = userService.edit(id, editUser);
        EntityModel<User> entityModel = userAssembler.toModel(updateUser);
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    @DeleteMapping("/api/delete/{id}")
    ResponseEntity<?>  deleteUserById(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
