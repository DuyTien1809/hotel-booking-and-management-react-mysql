package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "gia_hang_phong")
@IdClass(GiaHangPhongId.class)
public class GiaHangPhong {
    
    @Id
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;
    
    @Id
    @Column(name = "NGAYAPDUNG")
    private LocalDate ngayApDung;
    
    @Column(name = "GIA")
    private BigDecimal gia;
    
    @Column(name = "NGAY_THIET_LAP")
    private LocalDate ngayThietLap;
    
    @Column(name = "ID_NV")
    private String idNv;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANG_PHONG", insertable = false, updatable = false)
    private HangPhong hangPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV", insertable = false, updatable = false)
    private NhanVien nhanVien;
}
