package com.dev.Hotel.repo;

import com.dev.Hotel.entity.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, String> {

    @Query(value = "SELECT km.* FROM khuyenmai km JOIN ctkhuyenmai ct ON km.ID_KM = ct.ID_KM " +
            "WHERE ct.ID_HANGPHONG = :idHangPhong " +
            "AND km.NGAY_BAT_DAU <= :ngayHienTai AND km.NGAY_KET_THUC >= :ngayHienTai", nativeQuery = true)
    List<KhuyenMai> findActiveByHangPhongId(@Param("idHangPhong") Integer idHangPhong,
            @Param("ngayHienTai") LocalDate ngayHienTai);

    @Query("SELECT km FROM KhuyenMai km WHERE km.ngayBatDau <= :ngayHienTai AND km.ngayKetThuc >= :ngayHienTai")
    List<KhuyenMai> findActivePromotions(@Param("ngayHienTai") LocalDate ngayHienTai);

    // Method for finding active promotions by hang phong
    default List<KhuyenMai> findActivePromotionsByHangPhong(Integer idHangPhong, LocalDate ngayHienTai) {
        return findActiveByHangPhongId(idHangPhong, ngayHienTai);
    }
}
