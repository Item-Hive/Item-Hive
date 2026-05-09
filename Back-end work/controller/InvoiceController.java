package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.Invoice;
import za.ac.cput.branded.service.InvoiceService;

import java.util.List;

public class InvoiceController {
    private final InvoiceService invoiceService;

    private InvoiceController(InvoiceService invoiceService){
        this.invoiceService = invoiceService;
    }
    @PostMapping
    public Invoice create(@RequestBody Invoice invoices){
        return invoiceService.create(invoices);
    }
    @PutMapping
    public Invoice update(@RequestBody Invoice invoices){
        return invoiceService.update(invoices);
    }
    @GetMapping("/{id}")
    public Invoice read(@PathVariable String id){
        return invoiceService.read(id);
    }
    @GetMapping
    public List<Invoice> getAll(){
        return invoiceService.getAll();
    }
    @DeleteMapping("/{id}")
    public void delete(String id){
        invoiceService.delete(id);
    }
}
