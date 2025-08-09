package com.dev.Hotel.repo;

import com.dev.Hotel.entity.CtPhuThu;
import com.dev.Hotel.entity.CtPhuThuId;
import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.entity.PhuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CtPhuThuRepository extends JpaRepository<CtPhuThu, CtPhuThuId> {
    
    List<CtPhuThu> findByCtPhieuThue(CtPhieuThue ctPhieuThue);
    
    List<CtPhuThu> findByPhuThu(PhuThu phuThu);
    
    @Query("SELECT cp FROM CtPhuThu cp WHERE cp.ctPhieuThue.idCtPt = :idCtPt")
    List<CtPhuThu> findByCtPhieuThueId(@Param("idCtPt") Integer idCtPt);
    
    @Query("SELECT cp FROM CtPhuThu cp WHERE cp.phuThu.idPhuThu = :idPhuThu")
    List<CtPhuThu> findByPhuThuId(@Param("idPhuThu") String idPhuThu);

    @Query("SELECT cp FROM CtPhuThu cp WHERE cp.id.idPhuThu = :idPhuThu AND cp.id.idCtPt = :idCtPt")
    CtPhuThu findByIdPhuThuAndIdCtPt(@Param("idPhuThu") String idPhuThu, @Param("idCtPt") Integer idCtPt);
    
    @Query("SELECT cp FROM CtPhuThu cp WHERE cp.ttThanhToan = :trangThai")
    List<CtPhuThu> findByTtThanhToan(@Param("trangThai") String trangThai);
    
    // Query to get all surcharge usage with details
    @Query("SELECT cp FROM CtPhuThu cp " +
           "JOIN FETCH cp.phuThu pt " +
           "JOIN FETCH cp.ctPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pth " +
           "JOIN FETCH pth.khachHang kh " +
           "JOIN FETCH ct.phong p")
    List<CtPhuThu> findAllWithDetails();
    
    // Query to get current active surcharge usage (excluding checkout today)
    @Query("SELECT cp FROM CtPhuThu cp " +
           "JOIN FETCH cp.phuThu pt " +
           "JOIN FETCH cp.ctPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pth " +
           "JOIN FETCH pth.khachHang kh " +
           "JOIN FETCH ct.phong p " +
           "WHERE ct.ngayDen <= :currentDate AND ct.ngayDi > :currentDate")
    List<CtPhuThu> findCurrentActiveSurcharges(@Param("currentDate") LocalDate currentDate);
}
