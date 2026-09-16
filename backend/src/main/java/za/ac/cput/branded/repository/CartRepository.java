package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Cart;

public interface CartRepository extends JpaRepository<Cart,String> {
}
