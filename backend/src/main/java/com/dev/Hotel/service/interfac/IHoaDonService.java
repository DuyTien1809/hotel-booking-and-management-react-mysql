package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.CreateInvoiceRequest;
import com.dev.Hotel.dto.Response;

public interface IHoaDonService {
    
    // CRUD operations
    Response getAllHoaDon();
    Response getHoaDonById(String idHd);
    Response createHoaDon(CreateInvoiceRequest request);
    Response updateHoaDon(String idHd, CreateInvoiceRequest request);
    Response deleteHoaDon(String idHd);
    
    // Business logic
    Response getHoaDonByPhieuThue(Integer idPt);
    Response createInvoiceFromCheckout(Integer idPt);
    Response updateInvoiceStatus(String idHd, String trangThai);
    
    // Reports
    Response getInvoicesByDateRange(String startDate, String endDate);
    Response getInvoicesByStatus(String trangThai);
}
