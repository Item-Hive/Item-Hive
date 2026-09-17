package za.ac.cput.branded.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.branded.domain.Student;

public interface StudentRepository extends JpaRepository<Student, String> {
    Student findByStudentNumber(String studentNumber);
}