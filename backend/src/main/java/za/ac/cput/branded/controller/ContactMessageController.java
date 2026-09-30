package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.ContactMessage;
import za.ac.cput.branded.service.ContactMessageService;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    private final ContactMessageService service;

    public ContactMessageController(ContactMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ContactMessage create(@RequestBody ContactMessage contactMessage) {
        return service.create(contactMessage);
    }

    @PutMapping
    public ContactMessage update(@RequestBody ContactMessage contactMessage) {
        return service.update(contactMessage);
    }

    @GetMapping("/{id}")
    public ContactMessage read(@PathVariable String id) {
        return service.read(id);
    }

    @GetMapping
    public List<ContactMessage> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
