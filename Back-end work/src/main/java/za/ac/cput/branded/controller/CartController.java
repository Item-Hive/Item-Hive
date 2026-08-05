package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.Cart;
import za.ac.cput.branded.service.CartService;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    private CartController(CartService cartService){
        this.cartService = cartService;
    }
    @PostMapping
    public Cart create(@RequestBody Cart cart) {
        return cartService.create(cart);
    }
    @PutMapping
    public Cart update(@RequestBody Cart cart){
        return cartService.update(cart);
    }
    @GetMapping
    public List<Cart> getAll(){
        return cartService.getAll();
    }
    @GetMapping("/{id}")
    public Cart read(@PathVariable String id){
       return cartService.read(id);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        cartService.delete(id);
    }
}
