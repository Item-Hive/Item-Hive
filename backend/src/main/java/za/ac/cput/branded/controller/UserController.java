package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.User;
import za.ac.cput.branded.domain.UserDTO;
import za.ac.cput.branded.service.UserService;

import java.util.List;
@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:5173")

public class UserController {
    private final UserService service;
    public UserController(UserService service){
        this.service = service;
    }

    @PostMapping
    public User create(@RequestBody UserDTO user){
        return service.create(user);
    }

    @GetMapping("/{id}")
    public User read(@PathVariable String id){
        return service.read(id);
    }

    @GetMapping
    public List<User> getAll(){
        return service.getAll();
    }

    @PutMapping
    public User update(@RequestBody UserDTO user){
        return service.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        service.delete(id);
    }
}
