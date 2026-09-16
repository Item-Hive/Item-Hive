package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Receipt;

public interface ReceiptRepository extends JpaRepository<Receipt,String> {
}
