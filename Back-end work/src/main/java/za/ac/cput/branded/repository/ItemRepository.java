package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Item;

public interface ItemRepository extends JpaRepository<Item, String> {
}
