package web.service;

import web.model.Role;

import java.util.List;

public interface RoleService {

    List<Role> findAll();

    Role findByID(Long id);

    Role getRole(String userRole);

    Role getRoleById(Long id);

    void addRole(Role role);
}
