package za.ac.cput.branded.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import za.ac.cput.branded.service.CartService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CartControllerTest {

    @Mock
    private CartService service;

    @InjectMocks
    private CartController controller;

    @Test
    void testGetAll() {
        when(service.getAll()).thenReturn(List.of());
        List<?> result = controller.getAll();
        assertNotNull(result);
        verify(service).getAll();
    }

}
