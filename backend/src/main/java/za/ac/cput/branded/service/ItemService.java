package za.ac.cput.branded.service;
import org.springframework.stereotype.Service;
import za.ac.cput.branded.domain.Item;
import za.ac.cput.branded.repository.ItemRepository;

import java.util.List;
@Service
public class ItemService implements IItemService{
    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository){
        this.itemRepository = itemRepository;
    }

    @Override
    public Item create(Item item) {
        if(item == null)return null;
        return itemRepository.save(item);
    }

    @Override
    public Item read(String id) {
        return itemRepository.findById(id).orElse(null);
    }

    @Override
    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    @Override
    public Item update(Item item) {
        if(item == null)return null;
        return itemRepository.save(item);
    }

    @Override
    public void delete(String id) {
        itemRepository.deleteById(id);
    }
}
