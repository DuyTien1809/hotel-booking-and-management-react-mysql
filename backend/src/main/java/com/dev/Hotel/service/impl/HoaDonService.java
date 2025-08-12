package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.CreateInvoiceRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.*;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.*;
import com.dev.Hotel.service.interfac.IHoaDonService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class HoaDonService implements IHoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private CtDichVuRepository ctDichVuRepository;

    @Autowired
    private CtPhuThuRepository ctPhuThuRepository;

    @Override
    public Response getAllHoaDon() {
        Response response = new Response();
        try {
            List<HoaDon> hoaDonList = hoaDonRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHoaDonList(EntityDTOMapper.mapHoaDonListToDTO(hoaDonList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHoaDonById(String idHd) {
        Response response = new Response();
        try {
            Optional<HoaDon> hoaDonOptional = hoaDonRepository.findById(idHd);
            if (hoaDonOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(hoaDonOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hóa đơn");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createHoaDon(CreateInvoiceRequest request) {
        Response response = new Response();
        try {
            // Validate request
            if (request.getIdPt() == null) {
                throw new OurException("ID phiếu thuê không được để trống");
            }

            // Find PhieuThue
            PhieuThue phieuThue = phieuThueRepository.findById(request.getIdPt())
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            // Find NhanVien
            NhanVien nhanVien = null;
            if (request.getIdNv() != null) {
                nhanVien = nhanVienRepository.findById(request.getIdNv())
                        .orElseThrow(() -> new OurException("Không tìm thấy nhân viên"));
            }

            // Generate invoice ID
            String invoiceId = generateInvoiceId();

            // Create HoaDon
            HoaDon hoaDon = new HoaDon();
            hoaDon.setIdHd(invoiceId);
            hoaDon.setNgayLap(LocalDate.now());
            hoaDon.setTongTien(request.getTongTien());
            hoaDon.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Chưa thanh toán");
            hoaDon.setPhieuThue(phieuThue);
            hoaDon.setNhanVien(nhanVien);

            HoaDon savedHoaDon = hoaDonRepository.save(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Tạo hóa đơn thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(savedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    @Transactional
    public Response createInvoiceFromCheckout(Integer idPt) {
        Response response = new Response();
        try {
            // Find PhieuThue
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            // Check if invoice already exists
            Optional<HoaDon> existingInvoice = hoaDonRepository.findByPhieuThue(phieuThue);
            if (existingInvoice.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Hóa đơn đã tồn tại");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(existingInvoice.get()));
                return response;
            }

            // Calculate total amount
            BigDecimal totalAmount = calculateTotalAmount(phieuThue);

            // Generate invoice ID
            String invoiceId = generateInvoiceId();

            // Create HoaDon
            HoaDon hoaDon = new HoaDon();
            hoaDon.setIdHd(invoiceId);
            hoaDon.setNgayLap(LocalDate.now());
            hoaDon.setTongTien(totalAmount);
            hoaDon.setTrangThai("Chưa thanh toán");
            hoaDon.setPhieuThue(phieuThue);
            hoaDon.setNhanVien(phieuThue.getNhanVien());

            HoaDon savedHoaDon = hoaDonRepository.save(hoaDon);

            // Cập nhật ID hóa đơn vào tất cả CtPhieuThue
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
            System.out.println("Updating " + ctPhieuThueList.size() + " CtPhieuThue records with invoice ID: "
                    + savedHoaDon.getIdHd());

            for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
                ctPhieuThue.setIdHd(savedHoaDon.getIdHd());
                CtPhieuThue updated = ctPhieuThueRepository.save(ctPhieuThue);
                System.out.println(
                        "Updated CtPhieuThue ID: " + updated.getIdCtPt() + " with invoice ID: " + updated.getIdHd());

                // Cập nhật ID hóa đơn vào tất cả CtDichVu của CtPhieuThue này
                List<CtDichVu> ctDichVuList = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtDichVu ctDichVu : ctDichVuList) {
                    if (!"Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                        ctDichVu.setIdHd(savedHoaDon.getIdHd());
                        ctDichVuRepository.save(ctDichVu);
                    }
                }

                // Cập nhật ID hóa đơn vào tất cả CtPhuThu của CtPhieuThue này
                List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue);
                for (CtPhuThu ctPhuThu : ctPhuThuList) {
                    if (!"Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                        ctPhuThu.setIdHd(savedHoaDon.getIdHd());
                        ctPhuThuRepository.save(ctPhuThu);
                    }
                }
            }

            response.setStatusCode(200);
            response.setMessage("Tạo hóa đơn từ checkout thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(savedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hóa đơn từ checkout: " + e.getMessage());
        }
        return response;
    }

    private BigDecimal calculateTotalAmount(PhieuThue phieuThue) {
        BigDecimal total = BigDecimal.ZERO;

        // Add room charges
        List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue);
        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            if (ctPhieuThue.getDonGia() != null) {
                // Calculate days with new logic: only count extra day if checkout after
                // midnight
                LocalDate checkInDate = ctPhieuThue.getNgayDen();
                LocalDate checkOutDate = ctPhieuThue.getNgayDi() != null ? ctPhieuThue.getNgayDi() : LocalDate.now();

                long days = java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
                days = Math.max(1, days); // At least 1 day

                total = total.add(ctPhieuThue.getDonGia().multiply(BigDecimal.valueOf(days)));
            }
        }

        // Add service charges - find by CtPhieuThue, chỉ tính các dịch vụ chưa thanh
        // toán
        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            List<CtDichVu> ctDichVuList = ctDichVuRepository.findByCtPhieuThue(ctPhieuThue);
            for (CtDichVu ctDichVu : ctDichVuList) {
                if (ctDichVu.getDonGia() != null && ctDichVu.getSoLuong() != null
                        && !"Đã thanh toán".equals(ctDichVu.getTtThanhToan())) {
                    total = total.add(ctDichVu.getDonGia().multiply(BigDecimal.valueOf(ctDichVu.getSoLuong())));
                }
            }
        }

        // Add surcharges - find by CtPhieuThue, chỉ tính các phụ thu chưa thanh toán
        for (CtPhieuThue ctPhieuThue : ctPhieuThueList) {
            List<CtPhuThu> ctPhuThuList = ctPhuThuRepository.findByCtPhieuThue(ctPhieuThue);
            for (CtPhuThu ctPhuThu : ctPhuThuList) {
                if (ctPhuThu.getDonGia() != null && ctPhuThu.getSoLuong() != null
                        && !"Đã thanh toán".equals(ctPhuThu.getTtThanhToan())) {
                    total = total.add(ctPhuThu.getDonGia().multiply(BigDecimal.valueOf(ctPhuThu.getSoLuong())));
                }
            }
        }

        return total;
    }

    private String generateInvoiceId() {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String prefix = "HD" + today;

        // Find the latest invoice for today
        List<HoaDon> todayInvoices = hoaDonRepository.findByIdHdStartingWithOrderByIdHdDesc(prefix);

        int nextNumber = 1;
        if (!todayInvoices.isEmpty()) {
            String lastId = todayInvoices.get(0).getIdHd();
            String numberPart = lastId.substring(prefix.length());
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%02d", nextNumber);
    }

    @Override
    public Response updateHoaDon(String idHd, CreateInvoiceRequest request) {
        Response response = new Response();
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            if (request.getTongTien() != null) {
                hoaDon.setTongTien(request.getTongTien());
            }
            if (request.getTrangThai() != null) {
                hoaDon.setTrangThai(request.getTrangThai());
            }

            HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Cập nhật hóa đơn thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(updatedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteHoaDon(String idHd) {
        Response response = new Response();
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            hoaDonRepository.delete(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Xóa hóa đơn thành công");

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHoaDonByPhieuThue(Integer idPt) {
        Response response = new Response();
        try {
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            Optional<HoaDon> hoaDonOptional = hoaDonRepository.findByPhieuThue(phieuThue);
            if (hoaDonOptional.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(hoaDonOptional.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hóa đơn cho phiếu thuê này");
            }

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateInvoiceStatus(String idHd, String trangThai) {
        Response response = new Response();
        try {
            HoaDon hoaDon = hoaDonRepository.findById(idHd)
                    .orElseThrow(() -> new OurException("Không tìm thấy hóa đơn"));

            hoaDon.setTrangThai(trangThai);
            HoaDon updatedHoaDon = hoaDonRepository.save(hoaDon);

            response.setStatusCode(200);
            response.setMessage("Cập nhật trạng thái hóa đơn thành công");
            response.setHoaDon(EntityDTOMapper.mapHoaDonToDTO(updatedHoaDon));

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật trạng thái hóa đơn: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getInvoicesByDateRange(String startDate, String endDate) {
        Response response = new Response();
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            List<HoaDon> hoaDonList = hoaDonRepository.findByNgayLapBetween(start, end);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHoaDonList(EntityDTOMapper.mapHoaDonListToDTO(hoaDonList));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn theo khoảng thời gian: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getInvoicesByStatus(String trangThai) {
        Response response = new Response();
        try {
            List<HoaDon> hoaDonList = hoaDonRepository.findByTrangThai(trangThai);

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHoaDonList(EntityDTOMapper.mapHoaDonListToDTO(hoaDonList));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hóa đơn theo trạng thái: " + e.getMessage());
        }
        return response;
    }
}
