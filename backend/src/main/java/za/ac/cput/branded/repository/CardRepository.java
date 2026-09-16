package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Card;

public interface CardRepository extends JpaRepository<Card,String> {
}
