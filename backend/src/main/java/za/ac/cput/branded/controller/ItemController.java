package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.Item;
import za.ac.cput.branded.service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController {
    private final ItemService service ;

    public ItemController(ItemService service){
        this.service = service;
    }


    @PostMapping
    public Item create(@RequestBody Item item) {
        return service.create(item);
    }
    @PutMapping("/{id}")
    public Item update(@PathVariable String id, @RequestBody Item item){
        return service.update(item);
    }
    @GetMapping("/{id}")
    public Item read(@PathVariable String id){
        return service.read(id);
    }
    @GetMapping
    public List<Item> getAll() {
        return service.getAll();
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        service.delete(id);
    }
}
