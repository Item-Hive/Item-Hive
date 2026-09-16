package za.ac.cput.branded.service;
import za.ac.cput.branded.domain.Cart;

import java.util.List;

public interface ICartService {
    Cart create(Cart cart);
    Cart read(String id);
    Cart update(Cart cart);
    List<Cart> getAll();
    void delete(String id);
}