package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.ContactMessage;

import java.util.List;

public interface IContactMessageService {
    ContactMessage create(ContactMessage contactMessage);
    ContactMessage update(ContactMessage contactMessage);
    ContactMessage read(String id);
    List<ContactMessage> getAll();
    void delete(String id);
}
