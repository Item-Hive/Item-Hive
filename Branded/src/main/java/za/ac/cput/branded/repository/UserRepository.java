package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}