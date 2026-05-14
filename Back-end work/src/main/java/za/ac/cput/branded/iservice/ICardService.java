package za.ac.cput.branded.iservice;

import za.ac.cput.branded.domain.Card;
import za.ac.cput.branded.repository.CardRepository;

import java.util.List;

public interface ICardService {

    Card create(Card card);
    Card update(Card card);
    Card read(String id);
    List<Card> getAll();
    void delete(String id);
}
