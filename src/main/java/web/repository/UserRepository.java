package web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web.model.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "select user from User user left join fetch user.roles where user.username = :#{#username}")
    User findByUsername(@Param("username") String username);

    List<User> findAllByUsername(String username);
}
