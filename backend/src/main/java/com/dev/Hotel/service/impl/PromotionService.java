package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.PromotionsByRentalDTO;
import com.dev.Hotel.dto.HangPhongDTO;
import com.dev.Hotel.dto.KhuyenMaiDTO;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.entity.KhuyenMai;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.CtPhieuThueRepository;
import com.dev.Hotel.repo.KhuyenMaiRepository;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    /**
     * Lấy danh sách khuyến mãi available cho một phiếu thuê
     * Nhóm theo hạng phòng và bao gồm khuyến mãi tổng hóa đơn
     */
    public Response getPromotionsByRental(Integer idPt) {
        Response response = new Response();
        try {
            System.out.println("Getting promotions for rental ID: " + idPt);

            // 1. Tìm phiếu thuê
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            System.out.println("Found rental: " + phieuThue.getIdPt());

            // 2. Lấy danh sách chi tiết phiếu thuê (chỉ phòng chưa thanh toán)
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue)
                    .stream()
                    .filter(ct -> !"Đã thanh toán".equals(ct.getTtThanhToan()))
                    .collect(Collectors.toList());

            System.out.println("Found " + ctPhieuThueList.size() + " unpaid room details");

            if (ctPhieuThueList.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Không có phòng nào cần thanh toán");
                response.setPromotionsByRental(new PromotionsByRentalDTO());
                return response;
            }

            // 3. Nhóm theo hạng phòng
            Map<Integer, List<CtPhieuThue>> groupedByHangPhong = ctPhieuThueList.stream()
                    .filter(ct -> {
                        boolean hasRoom = ct.getPhong() != null;
                        boolean hasHangPhong = hasRoom && ct.getPhong().getHangPhong() != null;
                        System.out.println("CtPhieuThue " + ct.getIdCtPt() + " - hasRoom: " + hasRoom + ", hasHangPhong: " + hasHangPhong);
                        return hasHangPhong;
                    })
                    .collect(Collectors.groupingBy(ct -> ct.getPhong().getHangPhong().getIdHangPhong()));

            System.out.println("Grouped by hang phong: " + groupedByHangPhong.keySet());

            if (groupedByHangPhong.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Không có hạng phòng nào để áp dụng khuyến mãi");
                PromotionsByRentalDTO promotionsData = new PromotionsByRentalDTO();
                promotionsData.setRoomTypePromotions(new HashMap<>());
                promotionsData.setInvoicePromotions(new ArrayList<>());
                response.setPromotionsByRental(promotionsData);
                return response;
            }

            // 4. Tạo promotions by room type
            Map<Integer, PromotionsByRentalDTO.RoomTypePromotionDTO> roomTypePromotions = new HashMap<>();
            
            for (Map.Entry<Integer, List<CtPhieuThue>> entry : groupedByHangPhong.entrySet()) {
                Integer idHangPhong = entry.getKey();
                List<CtPhieuThue> roomsInCategory = entry.getValue();

                // Lấy thông tin hạng phòng từ phòng đầu tiên
                HangPhong hangPhong = roomsInCategory.get(0).getPhong().getHangPhong();
                
                // Lấy khuyến mãi available cho hạng phòng này
                List<KhuyenMai> availablePromotions = khuyenMaiRepository
                        .findActivePromotionsByHangPhong(idHangPhong, LocalDate.now());

                System.out.println("Found " + availablePromotions.size() + " promotions for hang phong " + idHangPhong);

                // Tính toán thông tin phòng
                List<String> roomNumbers = roomsInCategory.stream()
                        .map(ct -> ct.getPhong().getSoPhong())
                        .collect(Collectors.toList());

                BigDecimal totalRoomCharges = calculateRoomCharges(roomsInCategory);
                int roomCount = roomsInCategory.size();
                int nightCount = calculateNightCount(roomsInCategory);

                // Tạo DTO
                PromotionsByRentalDTO.RoomTypePromotionDTO roomTypePromo = 
                        new PromotionsByRentalDTO.RoomTypePromotionDTO();
                roomTypePromo.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(hangPhong));
                roomTypePromo.setRooms(roomNumbers);
                roomTypePromo.setAvailablePromotions(EntityDTOMapper.mapKhuyenMaiListToDTO(availablePromotions));
                roomTypePromo.setRoomCharges(totalRoomCharges);
                roomTypePromo.setRoomCount(roomCount);
                roomTypePromo.setNightCount(nightCount);

                roomTypePromotions.put(idHangPhong, roomTypePromo);
            }

            // 5. Lấy khuyến mãi tổng hóa đơn (nếu có)
            List<KhuyenMai> invoicePromotions = getInvoiceLevelPromotions(ctPhieuThueList.size());

            // 6. Tạo response
            PromotionsByRentalDTO promotionsData = new PromotionsByRentalDTO();
            promotionsData.setRoomTypePromotions(roomTypePromotions);
            promotionsData.setInvoicePromotions(EntityDTOMapper.mapKhuyenMaiListToDTO(invoicePromotions));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPromotionsByRental(promotionsData);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    /**
     * Tính tổng tiền phòng cho danh sách chi tiết phiếu thuê
     */
    private BigDecimal calculateRoomCharges(List<CtPhieuThue> ctPhieuThueList) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (CtPhieuThue ct : ctPhieuThueList) {
            if (ct.getDonGia() != null && ct.getNgayDen() != null) {
                // Tính số ngày
                LocalDate checkIn = ct.getNgayDen();
                LocalDate checkOut = ct.getNgayDi() != null ? ct.getNgayDi() : LocalDate.now();
                
                long days = Math.max(1, ChronoUnit.DAYS.between(checkIn, checkOut));
                BigDecimal roomTotal = ct.getDonGia().multiply(BigDecimal.valueOf(days));
                total = total.add(roomTotal);
            }
        }
        
        return total;
    }

    /**
     * Tính số đêm trung bình
     */
    private int calculateNightCount(List<CtPhieuThue> ctPhieuThueList) {
        if (ctPhieuThueList.isEmpty()) return 0;
        
        CtPhieuThue firstRoom = ctPhieuThueList.get(0);
        if (firstRoom.getNgayDen() == null) return 1;
        
        LocalDate checkIn = firstRoom.getNgayDen();
        LocalDate checkOut = firstRoom.getNgayDi() != null ? firstRoom.getNgayDi() : LocalDate.now();
        
        return (int) Math.max(1, ChronoUnit.DAYS.between(checkIn, checkOut));
    }

    /**
     * Lấy khuyến mãi cấp hóa đơn (ví dụ: giảm giá khi đặt nhiều phòng)
     */
    private List<KhuyenMai> getInvoiceLevelPromotions(int totalRooms) {
        List<KhuyenMai> invoicePromotions = new ArrayList<>();

        try {
            // Ví dụ: Khuyến mãi khi đặt >= 3 phòng
            if (totalRooms >= 3) {
                List<KhuyenMai> multiRoomPromotions = khuyenMaiRepository.findActivePromotions(LocalDate.now())
                        .stream()
                        .filter(km -> km.getMoTaKm() != null &&
                                     (km.getMoTaKm().toLowerCase().contains("nhiều phòng") ||
                                      km.getMoTaKm().toLowerCase().contains("đặt nhiều") ||
                                      km.getMoTaKm().toLowerCase().contains("tổng hóa đơn")))
                        .collect(Collectors.toList());
                invoicePromotions.addAll(multiRoomPromotions);
            }
        } catch (Exception e) {
            System.err.println("Error getting invoice level promotions: " + e.getMessage());
            // Trả về danh sách rỗng nếu có lỗi
        }

        return invoicePromotions;
    }
}
