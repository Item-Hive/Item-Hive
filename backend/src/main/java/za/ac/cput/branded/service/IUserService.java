package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.User;
import za.ac.cput.branded.domain.UserDTO;

import java.util.List;

public interface IUserService {
    User create(UserDTO card);
    User update(UserDTO card);
    User read(String id);
    List<User> getAll();
    void delete(String id);
}
