package web.modelAssembler;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import web.controller.RestControl;
import web.model.Role;
import web.model.User;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class RoleModelAssembler implements RepresentationModelAssembler<Role, EntityModel<Role>> {

    @Override
    public EntityModel<Role> toModel(Role role) {

        return EntityModel.of(role, //
                linkTo(methodOn(RestControl.class).getRoleByID(role.getId())).withSelfRel(),
                linkTo(methodOn(RestControl.class).getRoles()).withRel("api/getRoles"));
    }
}