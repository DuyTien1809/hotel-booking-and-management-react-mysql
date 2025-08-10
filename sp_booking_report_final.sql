CREATE DEFINER = `root` @`localhost` PROCEDURE `sp_booking_report_final`(
    IN p_ngay_bat_dau DATE,
    IN p_ngay_ket_thuc DATE,
    IN p_trang_thai VARCHAR(50) -- 'ALL', 'CHO_XAC_NHAN', 'XAC_NHAN', 'DA_CHECK_IN', 'DA_HUY'
) BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;
RESIGNAL;
END;
DROP TEMPORARY TABLE IF EXISTS temp_bao_cao;
CREATE TEMPORARY TABLE temp_bao_cao (
    id_pd INT,
    ngay_dat DATE,
    ngay_bd_thue DATE,
    ngay_di DATE,
    so_ngay_o INT,
    trang_thai_goc VARCHAR(50),
    so_tien_coc DECIMAL(12, 2),
    cccd_khach VARCHAR(20),
    ho_ten_khach VARCHAR(200),
    sdt_khach VARCHAR(20),
    email_khach VARCHAR(100),
    id_nv_dat VARCHAR(20),
    ho_ten_nv_dat VARCHAR(200),
    id_pt INT,
    ngay_check_in_thuc_te DATE,
    so_phong_dat INT,
    chi_tiet_phong TEXT,
    tong_tien_phong DECIMAL(18, 2)
);
INSERT INTO temp_bao_cao
SELECT pd.ID_PD,
    pd.NGAY_DAT,
    pd.NGAY_BD_THUE,
    pd.NGAY_DI,
    DATEDIFF(pd.NGAY_DI, pd.NGAY_BD_THUE) AS so_ngay_o,
    pd.TRANG_THAI AS trang_thai_goc,
    pd.SO_TIEN_COC,
    pd.CCCD,
    CONCAT(IFNULL(kh.HO, ''), ' ', IFNULL(kh.TEN, '')) AS ho_ten_khach,
    kh.SDT,
    kh.EMAIL,
    pd.ID_NV,
    CONCAT(IFNULL(nv.HO, ''), ' ', IFNULL(nv.TEN, '')) AS ho_ten_nv_dat,
    pt.ID_PT,
    pt.NGAY_LAP AS ngay_check_in_thuc_te,
    IFNULL(
        (
            SELECT SUM(cpd.SO_LUONG_PHONG_O)
            FROM ctphieudat cpd
            WHERE cpd.ID_PD = pd.ID_PD
        ),
        0
    ) AS so_phong_dat,
    IFNULL(
        (
            SELECT GROUP_CONCAT(
                    CONCAT(
                        kp.TEN_KP,
                        ' - ',
                        lp.TEN_LP,
                        ' (',
                        cpd.SO_LUONG_PHONG_O,
                        ' phòng)'
                    ) SEPARATOR '; '
                )
            FROM ctphieudat cpd
                JOIN hang_phong hp ON cpd.ID_HANG_PHONG = hp.ID_HANG_PHONG
                JOIN kieu_phong kp ON hp.ID_KP = kp.ID_KP
                JOIN loai_phong lp ON hp.ID_LP = lp.ID_LP
            WHERE cpd.ID_PD = pd.ID_PD
        ),
        'Chưa có thông tin phòng'
    ) AS chi_tiet_phong,
    IFNULL(
        (
            SELECT SUM(cpd.DON_GIA * cpd.SO_LUONG_PHONG_O)
            FROM ctphieudat cpd
            WHERE cpd.ID_PD = pd.ID_PD
        ),
        0
    ) AS tong_tien_phong
FROM phieudat pd
    LEFT JOIN khach_hang kh ON pd.CCCD = kh.CCCD
    LEFT JOIN nhan_vien nv ON pd.ID_NV = nv.ID_NV
    LEFT JOIN phieuthue pt ON pd.ID_PD = pt.ID_PD
WHERE pd.NGAY_DAT BETWEEN p_ngay_bat_dau AND p_ngay_ket_thuc;
-- Chi tiết
IF UPPER(p_trang_thai) = 'ALL' THEN
SELECT *
FROM temp_bao_cao
ORDER BY ngay_dat DESC,
    id_pd DESC;
ELSE
SELECT *
FROM temp_bao_cao
WHERE UPPER(trang_thai_goc) = UPPER(p_trang_thai)
ORDER BY ngay_dat DESC,
    id_pd DESC;
END IF;
-- Thống kê
SELECT 'THỐNG KÊ TỔNG QUAN' AS `Loại báo cáo`,
    COUNT(*) AS `Tổng số phiếu`,
    FORMAT(SUM(so_tien_coc), 0) AS `Tổng tiền cọc (VNĐ)`,
    FORMAT(SUM(tong_tien_phong), 0) AS `Tổng tiền phòng (VNĐ)`,
    SUM(so_phong_dat) AS `Tổng số phòng đặt`,
    ROUND(AVG(so_ngay_o), 1) AS `Số ngày ở TB`
FROM temp_bao_cao
WHERE (
        UPPER(p_trang_thai) = 'ALL'
        OR UPPER(trang_thai_goc) = UPPER(p_trang_thai)
    );
DROP TEMPORARY TABLE temp_bao_cao;
END