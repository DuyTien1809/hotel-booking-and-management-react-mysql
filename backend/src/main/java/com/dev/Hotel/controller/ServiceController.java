package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.DichVu;
import com.dev.Hotel.entity.PhuThu;
import com.dev.Hotel.repo.DichVuRepository;
import com.dev.Hotel.repo.PhuThuRepository;
import com.dev.Hotel.utils.EntityDTOMapper;
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

    // ===== DỊCH VỤ APIs =====
    
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

    @PostMapping("/dich-vu")
    public ResponseEntity<Response> createDichVu(@RequestBody DichVu dichVu) {
        Response response = new Response();
        try {
            DichVu savedDichVu = dichVuRepository.save(dichVu);
            
            // Tạo giá mặc định - không cần ID_NV khi tạo giá mặc định
            jdbcTemplate.update(
                "INSERT INTO gia_dich_vu (ID_DV, NGAY_AP_DUNG, GIA, ID_NV) VALUES (?, ?, ?, ?)",
                savedDichVu.getIdDv(), LocalDate.now(), BigDecimal.ZERO, null
            );
            
            response.setStatusCode(200);
            response.setMessage("Tạo dịch vụ thành công");
            response.setDichVu(EntityDTOMapper.mapDichVuToDTO(savedDichVu));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo dịch vụ: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/dich-vu/{id}")
    public ResponseEntity<Response> updateDichVu(@PathVariable String id, @RequestBody java.util.Map<String, Object> request) {
        Response response = new Response();
        try {
            if (dichVuRepository.existsById(id)) {
                // Cập nhật thông tin dịch vụ
                DichVu dichVu = new DichVu();
                dichVu.setIdDv(id);
                dichVu.setTenDv((String) request.get("tenDv"));
                dichVu.setMoTa((String) request.get("moTa"));
                dichVu.setDonViTinh((String) request.get("donViTinh"));

                DichVu updatedDichVu = dichVuRepository.save(dichVu);

                // Cập nhật giá nếu có trong request (thử nhiều field name)
                Object priceValue = null;
                if (request.containsKey("gia") && request.get("gia") != null) {
                    priceValue = request.get("gia");
                } else if (request.containsKey("giaHienTai") && request.get("giaHienTai") != null) {
                    priceValue = request.get("giaHienTai");
                } else if (request.containsKey("price") && request.get("price") != null) {
                    priceValue = request.get("price");
                }

                if (priceValue != null) {
                    BigDecimal price = new BigDecimal(priceValue.toString());
                    LocalDate today = LocalDate.now();
                    String idNv = (String) request.get("idNv");

                    // Thử UPDATE trước
                    int rowsUpdated = jdbcTemplate.update(
                        "UPDATE gia_dich_vu SET GIA = ?, ID_NV = ? WHERE ID_DV = ? AND NGAY_AP_DUNG = ?",
                        price, idNv, id, today
                    );

                    // Nếu không có record nào được update, thì INSERT mới
                    if (rowsUpdated == 0) {
                        jdbcTemplate.update(
                            "INSERT INTO gia_dich_vu (ID_DV, NGAY_AP_DUNG, GIA, ID_NV) VALUES (?, ?, ?, ?)",
                            id, today, price, idNv
                        );
                    }
                }

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
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/dich-vu/{id}")
    public ResponseEntity<Response> deleteDichVu(@PathVariable String id) {
        Response response = new Response();
        try {
            if (dichVuRepository.existsById(id)) {
                // Xóa giá trước
                jdbcTemplate.update("DELETE FROM gia_dich_vu WHERE ID_DV = ?", id);
                // Xóa dịch vụ
                dichVuRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("Xóa dịch vụ thành công");
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

    @PutMapping("/dich-vu/{id}/price")
    public ResponseEntity<Response> updateDichVuPrice(@PathVariable String id, @RequestBody java.util.Map<String, Object> request) {
        Response response = new Response();
        try {
            BigDecimal price = new BigDecimal(request.get("price").toString());
            LocalDate today = LocalDate.now();

            // Thử UPDATE trước
            int rowsUpdated = jdbcTemplate.update(
                "UPDATE gia_dich_vu SET GIA = ?, ID_NV = ? WHERE ID_DV = ? AND NGAY_AP_DUNG = ?",
                price, null, id, today
            );

            // Nếu không có record nào được update, thì INSERT mới
            if (rowsUpdated == 0) {
                jdbcTemplate.update(
                    "INSERT INTO gia_dich_vu (ID_DV, NGAY_AP_DUNG, GIA, ID_NV) VALUES (?, ?, ?, ?)",
                    id, today, price, null
                );
            }

            response.setStatusCode(200);
            response.setMessage("Cập nhật giá dịch vụ thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật giá dịch vụ: " + e.getMessage());
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }

    // ===== PHỤ THU APIs =====
    
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

    @PostMapping("/phu-thu")
    public ResponseEntity<Response> createPhuThu(@RequestBody PhuThu phuThu) {
        Response response = new Response();
        try {
            // Tạo phụ thu trong bảng phu_thu
            PhuThu savedPhuThu = phuThuRepository.save(phuThu);

            // Tạo giá mặc định trong bảng giaphuthu - không cần ID_NV khi tạo giá mặc định
            jdbcTemplate.update(
                "INSERT INTO giaphuthu (ID_PHU_THU, NGAY_AP_DUNG, GIA, ID_NV) VALUES (?, ?, ?, ?)",
                savedPhuThu.getIdPhuThu(), LocalDate.now(), BigDecimal.ZERO, null
            );

            response.setStatusCode(200);
            response.setMessage("Tạo phụ thu thành công");
            response.setPhuThu(EntityDTOMapper.mapPhuThuToDTO(savedPhuThu));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo phụ thu: " + e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/phu-thu/{id}")
    public ResponseEntity<Response> updatePhuThu(@PathVariable String id, @RequestBody java.util.Map<String, Object> request) {
        Response response = new Response();
        try {
            if (phuThuRepository.existsById(id)) {
                // Cập nhật thông tin phụ thu
                PhuThu phuThu = new PhuThu();
                phuThu.setIdPhuThu(id);
                phuThu.setTenPhuThu((String) request.get("tenPhuThu"));
                phuThu.setLyDo((String) request.get("lyDo"));

                PhuThu updatedPhuThu = phuThuRepository.save(phuThu);

                // Cập nhật giá nếu có trong request (thử nhiều field name)
                Object priceValue = null;
                if (request.containsKey("gia") && request.get("gia") != null) {
                    priceValue = request.get("gia");
                } else if (request.containsKey("giaHienTai") && request.get("giaHienTai") != null) {
                    priceValue = request.get("giaHienTai");
                } else if (request.containsKey("price") && request.get("price") != null) {
                    priceValue = request.get("price");
                }

                if (priceValue != null) {
                    BigDecimal price = new BigDecimal(priceValue.toString());
                    LocalDate today = LocalDate.now();
                    String idNv = (String) request.get("idNv");

                    // Thử UPDATE trước
                    int rowsUpdated = jdbcTemplate.update(
                        "UPDATE giaphuthu SET GIA = ?, ID_NV = ? WHERE ID_PHU_THU = ? AND NGAY_AP_DUNG = ?",
                        price, idNv, id, today
                    );

                    // Nếu không có record nào được update, thì INSERT mới
                    if (rowsUpdated == 0) {
                        jdbcTemplate.update(
                            "INSERT INTO giaphuthu (ID_PHU_THU, NGAY_AP_DUNG, GIA, ID_NV) VALUES (?, ?, ?, ?)",
                            id, today, price, idNv
                        );
                    }
                }

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
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/phu-thu/{id}")
    public ResponseEntity<Response> deletePhuThu(@PathVariable String id) {
        Response response = new Response();
        try {
            if (phuThuRepository.existsById(id)) {
                // Kiểm tra xem có khách hàng nào đang sử dụng không
                Integer usageCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM ct_phu_thu WHERE ID_PHU_THU = ?",
                    Integer.class, id
                );

                if (usageCount != null && usageCount > 0) {
                    response.setStatusCode(400);
                    response.setMessage("Không thể xóa phụ thu này vì đang có khách hàng sử dụng");
                } else {
                    // Xóa giá trước
                    jdbcTemplate.update("DELETE FROM giaphuthu WHERE ID_PHU_THU = ?", id);
                    // Xóa phụ thu
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

    @PutMapping("/phu-thu/{id}/price")
    public ResponseEntity<Response> updatePhuThuPrice(@PathVariable String id, @RequestBody java.util.Map<String, Object> request) {
        Response response = new Response();
        try {
            BigDecimal price = new BigDecimal(request.get("price").toString());
            LocalDate today = LocalDate.now();

            // Thử UPDATE trước
            int rowsUpdated = jdbcTemplate.update(
                "UPDATE giaphuthu SET GIA = ?, ID_NV = ? WHERE ID_PHU_THU = ? AND NGAY_AP_DUNG = ?",
                price, null, id, today
            );

            // Nếu không có record nào được update, thì INSERT mới
            if (rowsUpdated == 0) {
                jdbcTemplate.update(
                    "INSERT INTO giaphuthu (ID_PHU_THU, NGAY_AP_DUNG, GIA, ID_NV) VALUES (?, ?, ?, ?)",
                    id, today, price, null
                );
            }

            response.setStatusCode(200);
            response.setMessage("Cập nhật giá phụ thu thành công");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật giá phụ thu: " + e.getMessage());
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }
}
