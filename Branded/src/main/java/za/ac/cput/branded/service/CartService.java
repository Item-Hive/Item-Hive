package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Cart;
import za.ac.cput.branded.repository.CartRepository;

import java.util.List;

public class CartService implements ICartService{

    private final CartRepository cartRepository;

    private CartService(CartRepository cartRepository){
        this.cartRepository = cartRepository;
    }

    @Override
    public Cart create(Cart cart) {
        if (cart == null)return null;
        return cartRepository.save(cart);
    }

    @Override
    public Cart read(String id) {
        return cartRepository.findById(id).orElse(null);
    }

    @Override
    public Cart update(Cart cart) {
        if (cart == null)return null;
        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getAll() {
        return cartRepository.findAll();
    }

    @Override
    public void delete(String id) {
        cartRepository.deleteById(id);

    }
}
