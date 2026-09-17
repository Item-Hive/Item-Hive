package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Item;

import java.util.List;

public interface IItemService {
    Item create(Item item);
    Item read(String id);
    List<Item> getAll();
    Item update(Item item);
    void delete(String id);

}
