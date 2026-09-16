package za.ac.cput.branded.service;
import za.ac.cput.branded.domain.Invoice;

import java.util.List;

public interface IInvoiceService {
    Invoice create(Invoice invoices);
    Invoice read(String id);
    Invoice update(Invoice invoices);
    List<Invoice> getAll();
    void delete(String id);

}
