package za.ac.cput.branded.service;


import za.ac.cput.branded.domain.User;

import za.ac.cput.branded.domain.UserDTO;
import za.ac.cput.branded.factory.BrandedFactory;
import za.ac.cput.branded.repository.UserRepository;

import java.util.List;

public class UserService implements IUserService {
    private final UserRepository userRepository;

    private UserService (UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public User create(UserDTO request) {
        User user;
        switch (request.role.toLowerCase()) {

            case "student":
                user = BrandedFactory.createStudent(
                        request.studentNumber

                );
                break;

            case "admin":
                user = BrandedFactory.createAdmin(
                        request.idNumber

                );
                break;

            default:
                throw new IllegalArgumentException("Invalid order type");
        }
        return userRepository.save(user);

    }

    @Override
    public User update(UserDTO request) {
        User user;
        switch (request.role.toLowerCase()) {

            case "student":
                user = BrandedFactory.createStudent(
                        request.studentNumber

                );
                break;

            case "admin":
                user = BrandedFactory.createAdmin(
                        request.idNumber

                );
                break;

            default:
                throw new IllegalArgumentException("Invalid order type");
        }
        return userRepository.save(user);
    }

    @Override
    public User read(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public void delete(String id) {
        userRepository.deleteById(id);
    }
}
