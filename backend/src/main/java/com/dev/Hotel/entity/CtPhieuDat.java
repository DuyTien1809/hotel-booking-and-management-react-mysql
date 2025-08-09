package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ctphieudat")
public class CtPhieuDat {
    
    @EmbeddedId
    private CtPhieuDatId id;
    
    @Column(name = "SO_LUONG_PHONG_O")
    private Integer soLuongPhongO;
    
    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPd")
    @JoinColumn(name = "ID_PD")
    private PhieuDat phieuDat;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idHangPhong")
    @JoinColumn(name = "ID_HANG_PHONG")
    private HangPhong hangPhong;
}
