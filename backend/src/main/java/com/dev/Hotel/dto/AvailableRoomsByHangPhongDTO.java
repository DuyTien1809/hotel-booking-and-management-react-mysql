package com.dev.Hotel.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AvailableRoomsByHangPhongDTO {

    private Integer idHangPhong;
    private String tenHangPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;
    private Integer tongSoPhong;
    private Integer soPhongTrong;

    // Thông tin bổ sung
    private BigDecimal giaHienTai;
    private String moTaKieuPhong;
    private String moTaLoaiPhong;
    private Integer soLuongKhachO;

    // Danh sách ảnh
    private List<String> danhSachAnhUrl;

    // Tiện nghi
    private List<TienNghiDTO> danhSachTienNghi;

    // Khuyến mãi
    private List<KhuyenMaiDTO> danhSachKhuyenMai;

    // Constructor cho stored procedure result
    public AvailableRoomsByHangPhongDTO(Integer idHangPhong, String tenKieuPhong,
            String tenLoaiPhong, Integer tongSoPhong,
            Integer soPhongTrong) {
        this.idHangPhong = idHangPhong;
        this.tenKieuPhong = tenKieuPhong;
        this.tenLoaiPhong = tenLoaiPhong;
        this.tongSoPhong = tongSoPhong;
        this.soPhongTrong = soPhongTrong;
    }

    // Default constructor
    public AvailableRoomsByHangPhongDTO() {
    }
}
