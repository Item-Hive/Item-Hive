package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, String> {
}
