package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.service.impl.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    /**
     * Lấy danh sách khuyến mãi available cho một phiếu thuê
     * Nhóm theo hạng phòng và bao gồm khuyến mãi tổng hóa đơn
     */
    @GetMapping("/by-rental/{idPt}")
    public ResponseEntity<Response> getPromotionsByRental(@PathVariable Integer idPt) {
        Response response = promotionService.getPromotionsByRental(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Test endpoint để kiểm tra khuyến mãi
     */
    @GetMapping("/test")
    public ResponseEntity<String> testPromotions() {
        return ResponseEntity.ok("Promotion Controller is working!");
    }

    /**
     * Test endpoint để kiểm tra dữ liệu khuyến mãi
     */
    @GetMapping("/test-data")
    public ResponseEntity<Response> testPromotionData() {
        Response response = new Response();
        try {
            // Test basic data
            response.setStatusCode(200);
            response.setMessage("Test data endpoint working");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
