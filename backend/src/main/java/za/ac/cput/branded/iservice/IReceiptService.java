package za.ac.cput.branded.iservice;

import za.ac.cput.branded.domain.Receipt;

import java.util.List;

public interface IReceiptService {
    Receipt create (Receipt slip);
    Receipt read(String id);
    Receipt update(Receipt slip);
    List<Receipt> getAll();
    void delete(String id);
}
