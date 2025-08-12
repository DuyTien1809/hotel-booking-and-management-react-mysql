package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Embeddable
public class GiaDichVuId implements Serializable {
    @Column(name = "ID_DV")
    private String idDv;

    @Column(name = "NGAY_AP_DUNG")
    private LocalDate ngayApDung;
}

@Data
@Embeddable
class CtKhuyenMaiId implements Serializable {
    @Column(name = "ID_KM")
    private String idKm;

    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;
}

@Data
@Embeddable
class QuanLyId implements Serializable {
    @Column(name = "ID_BP")
    private String idBp;

    @Column(name = "MANV")
    private String maNv;
}

@Data
@Embeddable
class CtKhachOId implements Serializable {
    @Column(name = "ID_CT_PT")
    private Integer idCtPt;

    @Column(name = "CCCD")
    private String cccd;
}
