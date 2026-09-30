package za.ac.cput.branded.service;

import org.springframework.stereotype.Service;
import za.ac.cput.branded.domain.ContactMessage;
import za.ac.cput.branded.repository.ContactMessageRepository;

import java.time.Instant;
import java.util.List;

@Service
public class ContactMessageService implements IContactMessageService {

    private final ContactMessageRepository repository;

    public ContactMessageService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Override
    public ContactMessage create(ContactMessage contactMessage) {
        if (contactMessage == null) return null;

        // Fill in fields the front end doesn't send, so nothing is left null
        if (contactMessage.getStatus() == null) {
            contactMessage.setStatus("NEW");
        }
        if (contactMessage.getCreatedAt() == null) {
            contactMessage.setCreatedAt(Instant.now().toString());
        }

        return repository.save(contactMessage);
    }

    @Override
    public ContactMessage update(ContactMessage contactMessage) {
        if (contactMessage == null) return null;
        return repository.save(contactMessage);
    }

    @Override
    public ContactMessage read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<ContactMessage> getAll() {
        return repository.findAll();
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }
}
