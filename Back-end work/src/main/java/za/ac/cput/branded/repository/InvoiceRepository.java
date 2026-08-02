package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice,String> {
}
