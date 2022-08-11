package web.modelAssembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import web.controller.RestControl;
import web.model.User;

@Component
public class UserModelAssembler implements RepresentationModelAssembler<User, EntityModel<User>> {

    @Override
    public EntityModel<User> toModel(User user) {

        return EntityModel.of(user, //
                linkTo(methodOn(RestControl.class).getUserByID(user.getId())).withSelfRel(),
                linkTo(methodOn(RestControl.class).getUsers()).withRel("api/getUsers"));
    }
}
