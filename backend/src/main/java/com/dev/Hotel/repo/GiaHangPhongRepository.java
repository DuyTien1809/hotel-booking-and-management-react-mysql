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
       @Query(value = "SELECT * FROM gia_hang_phong ghp WHERE ghp.ID_HANG_PHONG = :idHangPhong " +
                     "AND ghp.NGAYAPDUNG <= :ngayHienTai " +
                     "ORDER BY ghp.NGAYAPDUNG DESC LIMIT 1", nativeQuery = true)
       Optional<GiaHangPhong> findLatestPriceByHangPhong(@Param("idHangPhong") Integer idHangPhong,
                     @Param("ngayHienTai") LocalDate ngayHienTai);

       // Lấy giá phòng tại một ngày cụ thể
       @Query(value = "SELECT * FROM gia_hang_phong ghp WHERE ghp.ID_HANG_PHONG = :idHangPhong " +
                     "AND ghp.NGAYAPDUNG <= :ngayApDung " +
                     "ORDER BY ghp.NGAYAPDUNG DESC LIMIT 1", nativeQuery = true)
       Optional<GiaHangPhong> findPriceByHangPhongAndDate(@Param("idHangPhong") Integer idHangPhong,
                     @Param("ngayApDung") LocalDate ngayApDung);
}
