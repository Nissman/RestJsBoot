package web.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import web.exception.EmailException;
import web.exception.UserEmailAlreadyExist;
import web.exception.UserNotFoundException;
import web.model.Role;
import web.model.User;
import web.repository.RoleRepository;
import web.repository.UserRepository;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;


    @Autowired
    public UserServiceImp(UserRepository userRepository, RoleRepository repository) {
        this.userRepository = userRepository;
        this.roleRepository = repository;
        defaultInsert();
    }

    private void defaultInsert() {
        roleRepository.save(new Role("ROLE_ADMIN"));
        roleRepository.save(new Role("ROLE_USER"));
        User user = new User();
        user.setFirstName("admin");
        user.setLastName("admin");
        user.setAge(230);
        user.setUsername("admin@mail.ru");
        user.setPassword(new BCryptPasswordEncoder().encode("100"));
        user.setRoles(roleRepository.findById(1L).stream().collect(Collectors.toSet()));
        userRepository.save(user);
        user = new User();
        user.setFirstName("user");
        user.setLastName("user");
        user.setAge(25);
        user.setUsername("user@mail.ru");
        user.setPassword(new BCryptPasswordEncoder().encode("100"));
        user.setRoles(roleRepository.findById(2L).stream().collect(Collectors.toSet()));
        userRepository.save(user);
    }

    @Override
    public User save(User user) {
          if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new EmailException(user.getUsername());
        } else  if (user.getUsername() == null || user.getUsername().equals("")) {
            throw new EmailException();
        }
        checkRole(user);
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
        }
        else {
            throw new UserNotFoundException(id);
        }

    }

    @Override
    public void edit(User user) {
        List<User> users = userRepository.findAllByUsername(user.getUsername());
        if (users.size() == 0 || users.size() == 1 && users.get(0).getId() == user.getId()) {
            checkRole(user);
            if (!userRepository.findById(user.getId()).get().getPassword().equals(user.getPassword())) {
                user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            }
            userRepository.save(user);
        }
    }

    @Override
    public User edit(Long id, User user) {

      return userRepository.findById(id).map(u -> {
                    user.setId(id);
                  List<User> users = userRepository.findAllByUsername(user.getUsername());
                  if (users.size() == 0 || users.size() == 1 && users.get(0).getId() == user.getId()) {
                      checkRole(user);
                      if (!userRepository.findById(user.getId()).get().getPassword().equals(user.getPassword())) {
                          user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
                      }

                  } else throw new UserEmailAlreadyExist(user.getUsername());
                  return  userRepository.save(user);
              })

              .orElseThrow(() -> new UserNotFoundException(id));



    }

    private void checkRole(User user) {
        Collection<Role> roles = user.getRoles();
        if (roles.size() == 0 || roles.stream().allMatch(Objects::isNull)) {
            user.setRoles(roleRepository.findById(2L).stream().collect(Collectors.toSet()));
        }
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findByID(Long id) {
        return userRepository.findById(id).orElseThrow(()-> new UserNotFoundException(id));
        // .getReferenceById(id);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User '%s' not found", username));
        }
        return user;
    }


}
