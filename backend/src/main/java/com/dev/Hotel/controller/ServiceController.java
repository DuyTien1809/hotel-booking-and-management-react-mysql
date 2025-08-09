package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.DichVu;
import com.dev.Hotel.entity.PhuThu;
import com.dev.Hotel.repo.DichVuRepository;
import com.dev.Hotel.repo.PhuThuRepository;
import com.dev.Hotel.utils.EntityDTOMapper;
import com.dev.Hotel.service.impl.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private PhuThuRepository phuThuRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/dich-vu")
    public ResponseEntity<Response> getAllDichVu() {
        Response response = new Response();
        try {
            List<DichVu> dichVuList = dichVuRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setDichVuList(EntityDTOMapper.mapDichVuListToDTO(dichVuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách dịch vụ: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/phu-thu")
    public ResponseEntity<Response> getAllPhuThu() {
        Response response = new Response();
        try {
            List<PhuThu> phuThuList = phuThuRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPhuThuList(EntityDTOMapper.mapPhuThuListToDTO(phuThuList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phụ thu: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/dich-vu")
    public ResponseEntity<Response> createDichVu(@RequestBody DichVu dichVu) {
        Response response = new Response();
        try {
            DichVu savedDichVu = dichVuRepository.save(dichVu);

            // Create default price entry
            String insertPriceSql = "INSERT INTO gia_dich_vu (ID_DV, NGAY_AP_DUNG, GIA) VALUES (?, ?, ?)";
            jdbcTemplate.update(insertPriceSql, savedDichVu.getIdDv(), LocalDate.now(), BigDecimal.ZERO);

            response.setStatusCode(200);
            response.setMessage("Tạo dịch vụ thành công");
            response.setDichVu(EntityDTOMapper.mapDichVuToDTO(savedDichVu));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo dịch vụ: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/phu-thu")
    public ResponseEntity<Response> createPhuThu(@RequestBody PhuThu phuThu) {
        Response response = new Response();
        try {
            PhuThu savedPhuThu = phuThuRepository.save(phuThu);

            // Create default price entry
            String insertPriceSql = "INSERT INTO thay_doi_gia_phu_thu (ID_PHU_THU, NGAY_AP_DUNG, GIA) VALUES (?, ?, ?)";
            jdbcTemplate.update(insertPriceSql, savedPhuThu.getIdPhuThu(), LocalDate.now(), BigDecimal.ZERO);

            response.setStatusCode(200);
            response.setMessage("Tạo phụ thu thành công");
            response.setPhuThu(EntityDTOMapper.mapPhuThuToDTO(savedPhuThu));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phụ thu: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/dich-vu/{id}")
    public ResponseEntity<Response> updateDichVu(@PathVariable String id, @RequestBody DichVu dichVu) {
        Response response = new Response();
        try {
            if (dichVuRepository.existsById(id)) {
                dichVu.setIdDv(id);
                DichVu updatedDichVu = dichVuRepository.save(dichVu);
                response.setStatusCode(200);
                response.setMessage("Cập nhật dịch vụ thành công");
                response.setDichVu(EntityDTOMapper.mapDichVuToDTO(updatedDichVu));
            } else {
                response.setStatusCode(404);
                response.setMessage("Dịch vụ không tồn tại");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật dịch vụ: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/phu-thu/{id}")
    public ResponseEntity<Response> updatePhuThu(@PathVariable String id, @RequestBody PhuThu phuThu) {
        Response response = new Response();
        try {
            if (phuThuRepository.existsById(id)) {
                phuThu.setIdPhuThu(id);
                PhuThu updatedPhuThu = phuThuRepository.save(phuThu);
                response.setStatusCode(200);
                response.setMessage("Cập nhật phụ thu thành công");
                response.setPhuThu(EntityDTOMapper.mapPhuThuToDTO(updatedPhuThu));
            } else {
                response.setStatusCode(404);
                response.setMessage("Phụ thu không tồn tại");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật phụ thu: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/dich-vu/{id}")
    public ResponseEntity<Response> deleteDichVu(@PathVariable String id) {
        Response response = new Response();
        try {
            if (dichVuRepository.existsById(id)) {
                // Check if service is being used by any customer
                String checkUsageSql = "SELECT COUNT(*) FROM ct_dich_vu WHERE ID_DV = ?";
                Integer usageCount = jdbcTemplate.queryForObject(checkUsageSql, Integer.class, id);

                if (usageCount != null && usageCount > 0) {
                    response.setStatusCode(400);
                    response.setMessage("Không thể xóa dịch vụ này vì đang có khách hàng sử dụng");
                } else {
                    // Delete price records first
                    String deletePriceSql = "DELETE FROM gia_dich_vu WHERE ID_DV = ?";
                    jdbcTemplate.update(deletePriceSql, id);

                    // Then delete service
                    dichVuRepository.deleteById(id);
                    response.setStatusCode(200);
                    response.setMessage("Xóa dịch vụ thành công");
                }
            } else {
                response.setStatusCode(404);
                response.setMessage("Dịch vụ không tồn tại");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa dịch vụ: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/phu-thu/{id}")
    public ResponseEntity<Response> deletePhuThu(@PathVariable String id) {
        Response response = new Response();
        try {
            if (phuThuRepository.existsById(id)) {
                // Check if surcharge is being used by any customer
                String checkUsageSql = "SELECT COUNT(*) FROM ct_phu_thu WHERE ID_PHU_THU = ?";
                Integer usageCount = jdbcTemplate.queryForObject(checkUsageSql, Integer.class, id);

                if (usageCount != null && usageCount > 0) {
                    response.setStatusCode(400);
                    response.setMessage("Không thể xóa phụ thu này vì đang có khách hàng sử dụng");
                } else {
                    // Delete price records first
                    String deletePriceSql = "DELETE FROM thay_doi_gia_phu_thu WHERE ID_PHU_THU = ?";
                    jdbcTemplate.update(deletePriceSql, id);

                    // Then delete surcharge
                    phuThuRepository.deleteById(id);
                    response.setStatusCode(200);
                    response.setMessage("Xóa phụ thu thành công");
                }
            } else {
                response.setStatusCode(404);
                response.setMessage("Phụ thu không tồn tại");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa phụ thu: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/dich-vu/{id}/price")
    public ResponseEntity<Response> updateServicePrice(@PathVariable String id, @RequestBody java.util.Map<String, Object> request) {
        Response response = new Response();
        try {
            BigDecimal price = new BigDecimal(request.get("price").toString());

            // Update price in gia_dich_vu table
            String updatePriceSql = "UPDATE gia_dich_vu SET GIA = ? WHERE ID_DV = ? AND NGAY_AP_DUNG = (SELECT MAX(NGAY_AP_DUNG) FROM (SELECT NGAY_AP_DUNG FROM gia_dich_vu WHERE ID_DV = ?) AS temp)";
            int rowsUpdated = jdbcTemplate.update(updatePriceSql, price, id, id);

            if (rowsUpdated == 0) {
                // If no existing price record, create new one
                String insertPriceSql = "INSERT INTO gia_dich_vu (ID_DV, NGAY_AP_DUNG, GIA) VALUES (?, ?, ?)";
                jdbcTemplate.update(insertPriceSql, id, LocalDate.now(), price);
            }

            response.setStatusCode(200);
            response.setMessage("Cập nhật giá dịch vụ thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật giá dịch vụ: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/phu-thu/{id}/price")
    public ResponseEntity<Response> updateSurchargePrice(@PathVariable String id, @RequestBody java.util.Map<String, Object> request) {
        Response response = new Response();
        try {
            BigDecimal price = new BigDecimal(request.get("price").toString());

            // Update price in thay_doi_gia_phu_thu table
            String updatePriceSql = "UPDATE thay_doi_gia_phu_thu SET GIA = ? WHERE ID_PHU_THU = ? AND NGAY_AP_DUNG = (SELECT MAX(NGAY_AP_DUNG) FROM (SELECT NGAY_AP_DUNG FROM thay_doi_gia_phu_thu WHERE ID_PHU_THU = ?) AS temp)";
            int rowsUpdated = jdbcTemplate.update(updatePriceSql, price, id, id);

            if (rowsUpdated == 0) {
                // If no existing price record, create new one
                String insertPriceSql = "INSERT INTO thay_doi_gia_phu_thu (ID_PHU_THU, NGAY_AP_DUNG, GIA) VALUES (?, ?, ?)";
                jdbcTemplate.update(insertPriceSql, id, LocalDate.now(), price);
            }

            response.setStatusCode(200);
            response.setMessage("Cập nhật giá phụ thu thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật giá phụ thu: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}
