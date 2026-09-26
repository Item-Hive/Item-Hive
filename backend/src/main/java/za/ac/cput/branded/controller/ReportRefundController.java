package za.ac.cput.branded.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.branded.domain.ReportRefund;
import za.ac.cput.branded.service.ReportRefundService;

import java.util.List;

@RestController
@RequestMapping("/api/reportrefund")
public class ReportRefundController {
    private ReportRefundService service;

    public ReportRefundController(ReportRefundService service){
        this.service = service;
    }
    @PostMapping
    public ReportRefund create(@RequestBody ReportRefund report){
        return service.create(report);
    }

    @PutMapping
    public ReportRefund update(@RequestBody ReportRefund report){
        return service.update(report);
    }
    @GetMapping ("/{id}")
    public ReportRefund read(@PathVariable String id){
        return  service.read(id);
    }
    @GetMapping
    public List<ReportRefund> getAll(){
        return service.getAll();
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){
        service.delete(id);
    }
}
