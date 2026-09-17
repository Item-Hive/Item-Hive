package za.ac.cput.branded.service;

import org.springframework.stereotype.Service;
import za.ac.cput.branded.domain.Card;
import za.ac.cput.branded.repository.CardRepository;

import java.util.List;

@Service
public class CardService implements ICardService {
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    @Override
    public Card create(Card card) {
        if (card == null) return null;
        return cardRepository.save(card);
    }

    @Override
    public Card update(Card card) {
        if (card == null) return null;
        return cardRepository.save(card);
    }

    @Override
    public Card read(String id) {
        return cardRepository.findById(id).orElse(null);
    }

    @Override
    public List<Card> getAll() {
        return cardRepository.findAll();
    }

    @Override
    public void delete(String id) {
        cardRepository.deleteById(id);
    }
}