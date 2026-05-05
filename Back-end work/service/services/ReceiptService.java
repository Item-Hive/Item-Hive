package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Receipt;
import za.ac.cput.branded.repository.ReceiptRepository;

import java.util.List;

public class ReceiptService implements IReceiptService{
    private final ReceiptRepository receiptRepository;

    private ReceiptService(ReceiptRepository receiptRepository){
        this.receiptRepository = receiptRepository;
    }

    @Override
    public Receipt create(Receipt slip) {
        if (slip == null)return null;
        return receiptRepository.save(slip);
    }

    @Override
    public Receipt read(String id) {
        return receiptRepository.findById(id).orElse(null);
    }

    @Override
    public Receipt update(Receipt slip) {
        if (slip == null)return null;
        return receiptRepository.save(slip);
    }

    @Override
    public List<Receipt> getAll() {
        return receiptRepository.findAll();
    }

    @Override
    public void delete(String id) {
        receiptRepository.deleteById(id);
    }
}
