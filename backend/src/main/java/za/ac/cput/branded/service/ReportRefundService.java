package za.ac.cput.branded.service;

import org.springframework.stereotype.Service;
import za.ac.cput.branded.domain.ReportRefund;
import za.ac.cput.branded.repository.ReportRefundRepository;

import java.util.List;
@Service
public class ReportRefundService implements IReportRefundService {
    private ReportRefundRepository repository;

    public ReportRefundService(ReportRefundRepository repository){
        this.repository = repository;
    }

    @Override
    public ReportRefund create(ReportRefund report) {
        if(report == null)return null;
        return repository.save(report);
    }

    @Override
    public ReportRefund update(ReportRefund report) {
        if(report == null )return null;
        return repository.save(report);
    }

    @Override
    public ReportRefund read(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<ReportRefund> getAll() {
        return repository.findAll();
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }
}
