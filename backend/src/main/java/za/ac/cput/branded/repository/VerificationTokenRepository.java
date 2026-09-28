package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.VerificationToken;

import java.util.Optional;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken, String> {

    Optional<VerificationToken> findByToken(String token);
}
