package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.Card;
import za.ac.cput.branded.service.CardService;

import java.util.List;

public class CardController {
    private final CardService cardService;

    private CardController(CardService cardService){
        this.cardService = cardService ;
    }
    @PostMapping
    public Card create(@RequestBody Card card){
        return cardService.create(card);
    }
    @PutMapping
    public Card update(@RequestBody Card card ){
        return cardService.update(card);
    }
    @GetMapping("/{id}")
    public Card read(String id){
        return cardService.read(id);
    }
    @GetMapping
    public List<Card> getAll() {
        return cardService.getAll();
    }
    @DeleteMapping("/{id}")
    public void delete(String id){
        cardService.delete(id);
    }
}
