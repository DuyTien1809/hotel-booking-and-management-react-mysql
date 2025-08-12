package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "gia_dich_vu")
class GiaDichVu {
    @EmbeddedId
    private GiaDichVuId id;

    @Column(name = "GIA")
    private BigDecimal gia;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idDv")
    @JoinColumn(name = "ID_DV")
    private DichVu dichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV")
    private NhanVien nhanVien;
}

@Data
@Entity
@Table(name = "giaphuthu")
class GiaPhuThu {
    @EmbeddedId
    private GiaPhuThuId id;

    @Column(name = "GIA")
    private BigDecimal gia;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPhuThu")
    @JoinColumn(name = "ID_PHU_THU")
    private PhuThu phuThu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV")
    private NhanVien nhanVien;
}

@Data
@Entity
@Table(name = "ctkhuyenmai")
class CtKhuyenMai {
    @EmbeddedId
    private CtKhuyenMaiId id;

    @Column(name = "PHAN_TRAM_GIAM")
    private BigDecimal phanTramGiam;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idKm")
    @JoinColumn(name = "ID_KM")
    private KhuyenMai khuyenMai;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idHangPhong")
    @JoinColumn(name = "ID_HANG_PHONG")
    private HangPhong hangPhong;
}

@Data
@Entity
@Table(name = "doiphong")
public class DoiPhong {
    @EmbeddedId
    private DoiPhongId id;

    @Column(name = "NGAY_DEN")
    private LocalDate ngayDen;

    @Column(name = "NGAY_DI")
    private LocalDate ngayDi;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCtPt")
    @JoinColumn(name = "ID_CT_PT")
    private CtPhieuThue ctPhieuThue;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("soPhongMoi")
    @JoinColumn(name = "SOPHONGMOI")
    private Phong phongMoi;
}

@Data
@Entity
@Table(name = "quan_ly")
class QuanLy {
    @EmbeddedId
    private QuanLyId id;

    @Column(name = "NGAYBDQL")
    private LocalDate ngayBdQl;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idBp")
    @JoinColumn(name = "ID_BP")
    private BoPhan boPhan;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maNv")
    @JoinColumn(name = "MANV")
    private NhanVien nhanVien;
}