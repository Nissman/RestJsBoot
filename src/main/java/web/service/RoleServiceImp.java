package web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.exception.UserNotFoundException;
import web.model.Role;
import web.model.User;
import web.repository.RoleRepository;

import java.util.List;

@Service
public class RoleServiceImp implements RoleService {


    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImp(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRole(String name) {
        return roleRepository.findByName("ROLE_" + name);
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.getById(id);
    }

    @Override
    public void addRole(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role findByID(Long id) {
        return roleRepository.findById(id).orElseThrow(()-> new UserNotFoundException(id));
    }
}
