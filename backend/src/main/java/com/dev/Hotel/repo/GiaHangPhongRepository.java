package com.dev.Hotel.repo;

import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.entity.GiaHangPhongId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface GiaHangPhongRepository extends JpaRepository<GiaHangPhong, GiaHangPhongId> {
    
    // Lấy giá phòng hiện tại (mới nhất) cho một hạng phòng
    @Query("SELECT ghp FROM GiaHangPhong ghp WHERE ghp.idHangPhong = :idHangPhong " +
           "AND ghp.ngayApDung <= :ngayHienTai " +
           "ORDER BY ghp.ngayApDung DESC")
    Optional<GiaHangPhong> findLatestPriceByHangPhong(@Param("idHangPhong") Integer idHangPhong, 
                                                      @Param("ngayHienTai") LocalDate ngayHienTai);
    
    // Lấy giá phòng tại một ngày cụ thể
    @Query("SELECT ghp FROM GiaHangPhong ghp WHERE ghp.idHangPhong = :idHangPhong " +
           "AND ghp.ngayApDung <= :ngayApDung " +
           "ORDER BY ghp.ngayApDung DESC")
    Optional<GiaHangPhong> findPriceByHangPhongAndDate(@Param("idHangPhong") Integer idHangPhong, 
                                                       @Param("ngayApDung") LocalDate ngayApDung);
}
