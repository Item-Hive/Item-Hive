package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Admin;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Admin findByIdNumber(String idNumber);
}