package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.repo.HangPhongRepository;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.service.interfac.IHangPhongService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HangPhongService implements IHangPhongService {

    @Autowired
    private HangPhongRepository hangPhongRepository;
    
    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    @Override
    public Response getAllHangPhong() {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findAllWithDetails();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongById(Integer idHangPhong) {
        Response response = new Response();
        try {
            Optional<HangPhong> hangPhong = hangPhongRepository.findById(idHangPhong);
            if (hangPhong.isPresent()) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(hangPhong.get()));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response createHangPhong(HangPhong hangPhong) {
        Response response = new Response();
        try {
            HangPhong savedHangPhong = hangPhongRepository.save(hangPhong);
            response.setStatusCode(200);
            response.setMessage("Tạo hạng phòng thành công");
            response.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(savedHangPhong));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateHangPhong(Integer idHangPhong, HangPhong hangPhong) {
        Response response = new Response();
        try {
            Optional<HangPhong> existingHangPhong = hangPhongRepository.findById(idHangPhong);
            if (existingHangPhong.isPresent()) {
                hangPhong.setIdHangPhong(idHangPhong);
                HangPhong updatedHangPhong = hangPhongRepository.save(hangPhong);
                response.setStatusCode(200);
                response.setMessage("Cập nhật hạng phòng thành công");
                response.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(updatedHangPhong));
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhật hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteHangPhong(Integer idHangPhong) {
        Response response = new Response();
        try {
            if (hangPhongRepository.existsById(idHangPhong)) {
                hangPhongRepository.deleteById(idHangPhong);
                response.setStatusCode(200);
                response.setMessage("Xóa hạng phòng thành công");
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xóa hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongByKieuPhong(String idKp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongId(idKp);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng theo kiểu phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongByLoaiPhong(String idLp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByLoaiPhongId(idLp);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng theo loại phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getHangPhongByKieuAndLoai(String idKp, String idLp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(idKp, idLp);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setHangPhongList(EntityDTOMapper.mapHangPhongListToDTO(hangPhongList));
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy hạng phòng theo kiểu và loại phòng: " + e.getMessage());
        }
        return response;
    }

    // Method to get room price by idKp and idLp
    public Response getRoomPriceByKieuAndLoai(String idKp, String idLp) {
        Response response = new Response();
        try {
            List<HangPhong> hangPhongList = hangPhongRepository.findByKieuPhongAndLoaiPhong(idKp, idLp);
            if (hangPhongList.isEmpty()) {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy hạng phòng với kiểu phòng và loại phòng này");
                return response;
            }
            
            // Get the first matching room category
            HangPhong hangPhong = hangPhongList.get(0);
            
            // Get current price
            Optional<GiaHangPhong> giaHangPhong = giaHangPhongRepository.findLatestPriceByHangPhong(
                hangPhong.getIdHangPhong(), 
                LocalDate.now()
            );
            
            BigDecimal roomPrice;
            if (giaHangPhong.isPresent()) {
                roomPrice = giaHangPhong.get().getGia();
            } else {
                roomPrice = BigDecimal.valueOf(500000); // Default price
            }
            
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setRoomPrice(roomPrice);
            response.setMinDeposit(roomPrice.multiply(BigDecimal.valueOf(0.2))); // 20% minimum deposit
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy giá phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAvailableHangPhong() {
        // Implementation for available room categories
        return getAllHangPhong();
    }

    @Override
    public Response getHangPhongWithAvailableRooms() {
        // Implementation for room categories with available rooms
        return getAllHangPhong();
    }

    @Override
    public Response getHangPhongStatistics() {
        Response response = new Response();
        try {
            long totalHangPhong = hangPhongRepository.count();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setStats(totalHangPhong);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thống kê hạng phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response searchHangPhong(String keyword) {
        // Implementation for search functionality
        return getAllHangPhong();
    }

    @Override
    public Response filterHangPhong(String idKp, String idLp) {
        if (idKp != null && idLp != null) {
            return getHangPhongByKieuAndLoai(idKp, idLp);
        } else if (idKp != null) {
            return getHangPhongByKieuPhong(idKp);
        } else if (idLp != null) {
            return getHangPhongByLoaiPhong(idLp);
        } else {
            return getAllHangPhong();
        }
    }
}
