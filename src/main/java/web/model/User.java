package web.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @Column(name = "first_name", nullable = false, length = 5)
    @Size(min = 1, max = 5, message = "minimal length '1' and maximum '5' symbols")
    private String firstName;

    @Column(name = "last_name", length = 45)
    private String lastName;

    @Column(name = "age")
    private int age;

    @Column(name = "email")
    @NotEmpty(message = "{EmptyField}")
    @Size(min = 2, message = "minimal length '2' symbols")
    private String username;

    @Column(name = "password", nullable = false)
    @NotEmpty(message = "{EmptyField}")
    @Size(min = 1, message = "minimal length '1' symbols")
    private String password;

    @Transient
    private String passwordConfirm;

    @ManyToMany//(fetch = FetchType.LAZY)
    //@Fetch(FetchMode.JOIN)
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @NotEmpty(message = "{EmptyField}")
    private Set<Role> roles = new HashSet<>();

    public User() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return this.firstName + " " + this.lastName;
    }

    public void setName(String name) {
        String[] parts = name.split(" ");
        this.firstName = parts[0];
        this.lastName = parts[1];
    }

    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.getRoles();
    }

    public List<Role> getRoles() {
        return roles.stream().sorted(Comparator.comparing(Role::getId)).collect(Collectors.toList());
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordConfirm() {
        return passwordConfirm;
    }

    public void setPasswordConfirm(String passwordConfirm) {
        this.passwordConfirm = passwordConfirm;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return firstName.equals(user.firstName) &&
                Objects.equals(lastName, user.lastName) && Objects.equals(age, user.age);
    }

    @Override
    public int hashCode() {
        int result = 1;
        result = 31 * result + ((firstName == null) ? 0 : firstName.hashCode());
        result = 31 * result + ((lastName == null) ? 0 : lastName.hashCode());
        result = 31 * result + Integer.hashCode(age);
        return result;
    }
}