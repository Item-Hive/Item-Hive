package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.Receipt;
import za.ac.cput.branded.service.ReceiptService;

import java.util.List;

public class ReceiptController {
    private final ReceiptService receiptService;

    private ReceiptController(ReceiptService receiptService){
        this.receiptService = receiptService;
    }
    @PostMapping
    public Receipt create(@RequestBody Receipt slip){
        return receiptService.create(slip);
    }
    @PutMapping
    public Receipt update(@RequestBody Receipt slip){
        return receiptService.update(slip);
    }
    @GetMapping("/{id}")
    public Receipt read(@PathVariable String id){
        return receiptService.read(id);
    }
    @GetMapping
    public List<Receipt> getAll(){
        return receiptService.getAll();
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        receiptService.delete(id);
    }
}
