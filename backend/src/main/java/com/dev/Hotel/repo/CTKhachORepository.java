package com.dev.Hotel.repo;

import com.dev.Hotel.entity.CtKhachO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CTKhachORepository extends JpaRepository<CtKhachO, CtKhachO.CtKhachOId> {
    
    // Tìm tất cả khách trong một chi tiết phiếu thuê
    @Query("SELECT c FROM CtKhachO c WHERE c.idCtPt = :idCtPt")
    List<CtKhachO> findByIdCtPt(@Param("idCtPt") Integer idCtPt);

    // Tìm khách theo CCCD
    @Query("SELECT c FROM CtKhachO c WHERE c.cccd = :cccd")
    List<CtKhachO> findByCccd(@Param("cccd") String cccd);

    // Tìm khách theo chi tiết phiếu thuê và CCCD
    @Query("SELECT c FROM CtKhachO c WHERE c.idCtPt = :idCtPt AND c.cccd = :cccd")
    CtKhachO findByIdCtPtAndCccd(@Param("idCtPt") Integer idCtPt, @Param("cccd") String cccd);

    // Xóa khách theo chi tiết phiếu thuê và CCCD
    @Modifying
    @Transactional
    @Query("DELETE FROM CtKhachO c WHERE c.idCtPt = :idCtPt AND c.cccd = :cccd")
    void deleteByIdCtPtAndCccd(@Param("idCtPt") Integer idCtPt, @Param("cccd") String cccd);

    // Xóa tất cả khách trong một chi tiết phiếu thuê
    @Modifying
    @Transactional
    @Query("DELETE FROM CtKhachO c WHERE c.idCtPt = :idCtPt")
    void deleteByIdCtPt(@Param("idCtPt") Integer idCtPt);

    // Kiểm tra khách đã có trong chi tiết phiếu thuê chưa
    @Query("SELECT COUNT(c) > 0 FROM CtKhachO c WHERE c.idCtPt = :idCtPt AND c.cccd = :cccd")
    boolean existsByIdCtPtAndCccd(@Param("idCtPt") Integer idCtPt, @Param("cccd") String cccd);

    // Đếm số khách trong một chi tiết phiếu thuê
    @Query("SELECT COUNT(c) FROM CtKhachO c WHERE c.idCtPt = :idCtPt")
    long countByIdCtPt(@Param("idCtPt") Integer idCtPt);

    // Lấy danh sách khách với thông tin chi tiết
    @Query("SELECT c FROM CtKhachO c " +
           "JOIN FETCH c.khachHang " +
           "WHERE c.idCtPt = :idCtPt")
    List<CtKhachO> findByIdCtPtWithKhachHang(@Param("idCtPt") Integer idCtPt);


}
