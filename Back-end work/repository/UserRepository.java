package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.User;

public interface UserRepository extends JpaRepository<User,String> {
}
