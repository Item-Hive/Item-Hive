package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Invoice;
import za.ac.cput.branded.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService implements IInvoiceService {
    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    public Invoice create(Invoice invoices) {
        if (invoices == null) return null;
        return invoiceRepository.save(invoices);
    }

    @Override
    public Invoice read(String id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    @Override
    public Invoice update(Invoice invoices) {
        if (invoices == null) return null;
        return invoiceRepository.save(invoices);
    }

    @Override
    public List<Invoice> getByUserId(String userId) {
    return invoiceRepository.findByReceipt_UserId(userId);
    }

    @Override
    public void delete(String id) {
        invoiceRepository.deleteById(id);
    }
}