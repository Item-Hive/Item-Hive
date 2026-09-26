package za.ac.cput.branded.service;

import za.ac.cput.branded.domain.Card;
import za.ac.cput.branded.domain.ReportRefund;

import java.util.List;

public interface IReportRefundService {
    ReportRefund create(ReportRefund report);
    ReportRefund update(ReportRefund report);
    ReportRefund read(String id);
    List<ReportRefund> getAll();
    void delete(String id);
}
