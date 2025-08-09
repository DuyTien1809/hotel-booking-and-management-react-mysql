package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "phieudat")
public class PhieuDat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PD")
    private Integer idPd;
    
    @Column(name = "NGAY_DAT")
    private LocalDate ngayDat;
    
    @Column(name = "NGAY_BD_THUE")
    private LocalDate ngayBdThue;
    
    @Column(name = "NGAY_DI")
    private LocalDate ngayDi;
    
    @Column(name = "TRANG_THAI")
    private String trangThai;
    
    @Column(name = "SO_TIEN_COC")
    private BigDecimal soTienCoc;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CCCD")
    private KhachHang khachHang;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV")
    private NhanVien nhanVien;

    @OneToMany(mappedBy = "phieuDat", cascade = CascadeType.ALL)
    private List<CtPhieuDat> chiTietPhieuDat;
}