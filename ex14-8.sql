-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: khachsan
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anh_hang_phong`
--

DROP TABLE IF EXISTS `anh_hang_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anh_hang_phong` (
  `ID_ANH_HANG_PHONG` varchar(10) NOT NULL,
  `URL_ANH` varchar(100) DEFAULT NULL,
  `ID_HANG_PHONG` int DEFAULT NULL,
  PRIMARY KEY (`ID_ANH_HANG_PHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  CONSTRAINT `anh_hang_phong_ibfk_1` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anh_hang_phong`
--

LOCK TABLES `anh_hang_phong` WRITE;
/*!40000 ALTER TABLE `anh_hang_phong` DISABLE KEYS */;
/*!40000 ALTER TABLE `anh_hang_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bo_phan`
--

DROP TABLE IF EXISTS `bo_phan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bo_phan` (
  `ID_BP` varchar(10) NOT NULL,
  `TENBP` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_BP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bo_phan`
--

LOCK TABLES `bo_phan` WRITE;
/*!40000 ALTER TABLE `bo_phan` DISABLE KEYS */;
INSERT INTO `bo_phan` VALUES ('BP001','Quản lý'),('BP002','Lễ tân'),('BP003','Nhân viên buồng'),('BP004','Bảo vệ');
/*!40000 ALTER TABLE `bo_phan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ct_dich_vu`
--

DROP TABLE IF EXISTS `ct_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ct_dich_vu` (
  `ID_CT_PT` int NOT NULL,
  `ID_DV` varchar(10) NOT NULL,
  `NGAY_SU_DUNG` date DEFAULT NULL,
  `DON_GIA` decimal(10,2) DEFAULT NULL,
  `SO_LUONG` int DEFAULT NULL,
  `ID_HD` varchar(10) DEFAULT NULL,
  `TT_THANH_TOAN` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PT`,`ID_DV`),
  KEY `ct_dich_vu_ibfk_2` (`ID_DV`),
  KEY `idx_ctdv_id_hd` (`ID_HD`),
  CONSTRAINT `ct_dich_vu_ibfk_1` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ct_dich_vu_ibfk_2` FOREIGN KEY (`ID_DV`) REFERENCES `dich_vu` (`ID_DV`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ctdv_hoa_don` FOREIGN KEY (`ID_HD`) REFERENCES `hoa_don` (`ID_HD`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ct_dich_vu`
--

LOCK TABLES `ct_dich_vu` WRITE;
/*!40000 ALTER TABLE `ct_dich_vu` DISABLE KEYS */;
INSERT INTO `ct_dich_vu` VALUES (3,'DV002','2025-08-10',300000.00,1,'HD25081101','Đã thanh toán'),(4,'DV003','2025-08-10',150000.00,1,'HD25081101','Đã thanh toán'),(5,'DV002','2025-08-10',300000.00,1,NULL,'Chưa thanh toán'),(6,'DV004','2025-08-05',200000.00,1,NULL,'Chưa thanh toán'),(6,'DV005','2025-08-10',350000.00,1,NULL,'Chưa thanh toán'),(6,'DV006','2025-08-10',80000.00,1,NULL,'Chưa thanh toán'),(7,'DV001','2025-08-10',88888.00,1,NULL,'Chưa thanh toán'),(8,'DV002','2025-08-10',300000.00,1,NULL,'Chưa thanh toán'),(9,'DV004','2025-08-09',200000.00,1,NULL,'Chưa thanh toán'),(17,'DV005','2025-08-10',350000.00,1,'HD25080801','Đã thanh toán'),(19,'DV005','2025-08-10',350000.00,1,NULL,'Đã thanh toán'),(21,'DV001','2025-08-11',50000.00,1,NULL,'Chưa thanh toán'),(22,'DV001','2025-08-12',50000.00,1,NULL,'Chưa thanh toán');
/*!40000 ALTER TABLE `ct_dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ct_phieu_thue`
--

DROP TABLE IF EXISTS `ct_phieu_thue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ct_phieu_thue` (
  `ID_CT_PT` int NOT NULL AUTO_INCREMENT,
  `NGAY_DEN` date DEFAULT NULL,
  `GIO_DEN` time DEFAULT NULL,
  `NGAY_DI` date DEFAULT NULL,
  `DON_GIA` decimal(10,2) DEFAULT NULL,
  `TT_THANH_TOAN` varchar(20) DEFAULT NULL,
  `ID_PT` int DEFAULT NULL,
  `SO_PHONG` varchar(10) DEFAULT NULL,
  `ID_HD` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PT`),
  KEY `ID_PT` (`ID_PT`),
  KEY `SO_PHONG` (`SO_PHONG`),
  KEY `idx_ctpt_id_hd` (`ID_HD`),
  CONSTRAINT `ct_phieu_thue_ibfk_1` FOREIGN KEY (`ID_PT`) REFERENCES `phieuthue` (`ID_PT`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ct_phieu_thue_ibfk_2` FOREIGN KEY (`SO_PHONG`) REFERENCES `phong` (`SOPHONG`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_ctpt_hoa_don` FOREIGN KEY (`ID_HD`) REFERENCES `hoa_don` (`ID_HD`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ct_phieu_thue`
--

LOCK TABLES `ct_phieu_thue` WRITE;
/*!40000 ALTER TABLE `ct_phieu_thue` DISABLE KEYS */;
INSERT INTO `ct_phieu_thue` VALUES (3,'2025-08-02','19:43:57','2025-08-11',1000000.00,'Đã thanh toán',3,'305','HD25081101'),(4,'2025-08-02','19:43:57','2025-08-11',800000.00,'Đã thanh toán',3,'102','HD25081101'),(5,'2025-08-01','14:43:57','2025-08-15',800000.00,'Chưa thanh toán',4,'101',NULL),(6,'2025-08-02','21:26:27','2025-08-15',1300000.00,'Chưa thanh toán',5,'403',NULL),(7,'2025-08-02','21:26:27','2025-08-15',1300000.00,'Chưa thanh toán',5,'406',NULL),(8,'2025-08-02','21:26:27','2025-08-15',1300000.00,'Chưa thanh toán',5,'407',NULL),(9,'2025-08-02','21:26:27','2025-08-15',1300000.00,'Chưa thanh toán',5,'203',NULL),(16,'2025-08-05','23:58:05','2025-08-08',5000000.00,'Đã thanh toán',8,'501','HD25080801'),(17,'2025-08-05','23:58:05','2025-08-08',1800000.00,'Đã thanh toán',8,'404','HD25080801'),(18,'2025-08-05','23:58:05','2025-08-08',1000000.00,'Đã thanh toán',8,'107','HD25080801'),(19,'2025-08-08','14:48:03','2025-08-12',1700000.00,'Chưa thanh toán',9,'304',NULL),(20,'2025-08-08','14:48:03','2025-08-12',1800000.00,'Chưa thanh toán',9,'207',NULL),(21,'2025-08-10','01:57:36','2025-08-13',1000000.00,'Chưa thanh toán',10,'504',NULL),(22,'2025-08-12','19:32:43','2025-08-15',800000.00,'Chưa thanh toán',11,'104',NULL),(23,'2025-08-12','19:32:43','2025-08-15',1000000.00,'Chưa thanh toán',11,'106',NULL),(24,'2025-08-12','21:31:43','2025-08-15',1200000.00,'Chưa thanh toán',12,'201',NULL),(25,'2025-08-12','21:31:43','2025-08-15',1300000.00,'Chưa thanh toán',12,'204',NULL),(26,'2025-08-12','03:55:13','2025-08-14',1800000.00,'Chưa thanh toán',13,'307',NULL);
/*!40000 ALTER TABLE `ct_phieu_thue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ct_phu_thu`
--

DROP TABLE IF EXISTS `ct_phu_thu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ct_phu_thu` (
  `ID_PHU_THU` varchar(10) NOT NULL,
  `ID_CT_PT` int NOT NULL,
  `ID_HD` varchar(10) DEFAULT NULL,
  `TT_THANH_TOAN` varchar(20) DEFAULT NULL,
  `DON_GIA` decimal(10,2) DEFAULT NULL,
  `SO_LUONG` int DEFAULT NULL,
  PRIMARY KEY (`ID_PHU_THU`,`ID_CT_PT`),
  KEY `ct_phu_thu_ibfk_2` (`ID_CT_PT`),
  KEY `idx_ctptt_id_hd` (`ID_HD`),
  CONSTRAINT `ct_phu_thu_ibfk_1` FOREIGN KEY (`ID_PHU_THU`) REFERENCES `phu_thu` (`ID_PHU_THU`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ct_phu_thu_ibfk_2` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ctphuthu_hoa_don` FOREIGN KEY (`ID_HD`) REFERENCES `hoa_don` (`ID_HD`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ct_phu_thu`
--

LOCK TABLES `ct_phu_thu` WRITE;
/*!40000 ALTER TABLE `ct_phu_thu` DISABLE KEYS */;
INSERT INTO `ct_phu_thu` VALUES ('PT001',3,'HD25081101','Đã thanh toán',200000.00,1),('PT001',4,'HD25081101','Đã thanh toán',400000.00,1),('PT001',6,NULL,'Chưa thanh toán',400000.00,1),('PT001',7,NULL,'Đã thanh toán',400000.00,1),('PT001',21,NULL,'Đã thanh toán',400000.00,1),('PT001',25,NULL,'Chưa thanh toán',400000.00,1),('PT002',3,'HD25081101','Đã thanh toán',500000.00,1),('PT002',5,NULL,'Chưa thanh toán',50000.00,1),('PT002',8,NULL,'Đã thanh toán',500000.00,1),('PT003',9,NULL,'Đã thanh toán',50000.00,1),('PT004',5,NULL,'Chưa thanh toán',200000.00,3),('PT012',21,NULL,'Chưa thanh toán',300000.00,1);
/*!40000 ALTER TABLE `ct_phu_thu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctkhacho`
--

DROP TABLE IF EXISTS `ctkhacho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctkhacho` (
  `ID_CT_PT` int NOT NULL,
  `CCCD` varchar(20) NOT NULL,
  PRIMARY KEY (`ID_CT_PT`,`CCCD`),
  KEY `CMND` (`CCCD`),
  CONSTRAINT `ctkhacho_ibfk_1` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ctkhacho_ibfk_2` FOREIGN KEY (`CCCD`) REFERENCES `khach_hang` (`CCCD`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctkhacho`
--

LOCK TABLES `ctkhacho` WRITE;
/*!40000 ALTER TABLE `ctkhacho` DISABLE KEYS */;
INSERT INTO `ctkhacho` VALUES (21,'001234567892'),(3,'001234567895'),(5,'001234567896');
/*!40000 ALTER TABLE `ctkhacho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctkhuyenmai`
--

DROP TABLE IF EXISTS `ctkhuyenmai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctkhuyenmai` (
  `ID_KM` varchar(10) NOT NULL,
  `ID_HANGPHONG` int NOT NULL,
  `PHAN_TRAM_GIAM` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`ID_KM`,`ID_HANGPHONG`),
  KEY `ID_HANGPHONG` (`ID_HANGPHONG`),
  CONSTRAINT `ctkhuyenmai_ibfk_1` FOREIGN KEY (`ID_KM`) REFERENCES `khuyenmai` (`ID_KM`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ctkhuyenmai_ibfk_2` FOREIGN KEY (`ID_HANGPHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctkhuyenmai`
--

LOCK TABLES `ctkhuyenmai` WRITE;
/*!40000 ALTER TABLE `ctkhuyenmai` DISABLE KEYS */;
INSERT INTO `ctkhuyenmai` VALUES ('KM001',1,10.00),('KM001',2,10.00),('KM001',3,10.00),('KM002',1,15.00),('KM002',2,15.00),('KM002',3,15.00),('KM002',4,15.00),('KM003',5,20.00),('KM003',6,20.00),('KM003',7,20.00),('KM004',1,30.00),('KM004',2,30.00),('KM004',3,30.00),('KM004',4,30.00),('KM004',5,30.00),('KM005',6,25.00),('KM005',7,25.00),('KM005',8,25.00),('KM006',1,50.00),('KM006',2,50.00),('KM006',3,50.00),('KM006',4,50.00),('KM006',5,50.00),('KM006',6,50.00),('KM006',7,50.00),('KM006',8,50.00);
/*!40000 ALTER TABLE `ctkhuyenmai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ctphieudat`
--

DROP TABLE IF EXISTS `ctphieudat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ctphieudat` (
  `ID_PD` int NOT NULL,
  `ID_HANG_PHONG` int NOT NULL,
  `SO_LUONG_PHONG_O` int DEFAULT NULL,
  `DON_GIA` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ID_PD`,`ID_HANG_PHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  CONSTRAINT `ctphieudat_ibfk_1` FOREIGN KEY (`ID_PD`) REFERENCES `phieudat` (`ID_PD`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ctphieudat_ibfk_2` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ctphieudat`
--

LOCK TABLES `ctphieudat` WRITE;
/*!40000 ALTER TABLE `ctphieudat` DISABLE KEYS */;
INSERT INTO `ctphieudat` VALUES (1,2,3,1000000.00),(1,4,3,1000000.00),(2,3,1,1200000.00),(3,1,2,800000.00),(4,5,1,1800000.00),(5,1,3,1700000.00),(5,6,3,1700000.00),(6,4,6,1700000.00),(11,1,2,800000.00);
/*!40000 ALTER TABLE `ctphieudat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cttiennghi`
--

DROP TABLE IF EXISTS `cttiennghi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cttiennghi` (
  `ID_TN` varchar(10) NOT NULL,
  `ID_HANG_PHONG` int NOT NULL,
  `SO_LUONG` int DEFAULT NULL,
  PRIMARY KEY (`ID_TN`,`ID_HANG_PHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  CONSTRAINT `cttiennghi_ibfk_1` FOREIGN KEY (`ID_TN`) REFERENCES `tiennghi` (`ID_TN`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cttiennghi_ibfk_2` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cttiennghi`
--

LOCK TABLES `cttiennghi` WRITE;
/*!40000 ALTER TABLE `cttiennghi` DISABLE KEYS */;
INSERT INTO `cttiennghi` VALUES ('TN001',1,1),('TN001',2,1),('TN001',3,1),('TN001',4,1),('TN001',5,1),('TN001',6,1),('TN001',7,1),('TN001',8,1),('TN002',1,1),('TN002',2,1),('TN002',3,1),('TN002',4,1),('TN002',5,1),('TN002',6,1),('TN002',7,2),('TN002',8,3),('TN003',1,1),('TN003',2,1),('TN003',3,1),('TN003',4,1),('TN003',5,1),('TN003',6,1),('TN003',7,2),('TN003',8,3),('TN004',1,1),('TN004',2,1),('TN004',3,1),('TN004',4,1),('TN004',5,1),('TN004',6,1),('TN004',7,1),('TN004',8,2),('TN005',1,1),('TN005',2,1),('TN005',3,1),('TN005',4,1),('TN005',5,1),('TN005',6,1),('TN005',7,1),('TN005',8,1),('TN006',2,1),('TN006',3,1),('TN006',4,1),('TN006',5,1),('TN006',6,1),('TN006',7,1),('TN006',8,2),('TN007',1,1),('TN007',2,1),('TN007',3,1),('TN007',4,1),('TN007',5,1),('TN007',6,1),('TN007',7,2),('TN007',8,3),('TN008',1,1),('TN008',2,1),('TN008',3,1),('TN008',4,1),('TN008',5,1),('TN008',6,1),('TN008',7,2),('TN008',8,3),('TN009',2,2),('TN009',3,2),('TN009',4,2),('TN009',5,2),('TN009',6,2),('TN009',7,4),('TN009',8,6),('TN010',3,2),('TN010',4,2),('TN010',5,2),('TN010',6,2),('TN010',7,4),('TN010',8,6);
/*!40000 ALTER TABLE `cttiennghi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dich_vu` (
  `ID_DV` varchar(10) NOT NULL,
  `TEN_DV` varchar(50) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  `DON_VI_TINH` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_DV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dich_vu`
--

LOCK TABLES `dich_vu` WRITE;
/*!40000 ALTER TABLE `dich_vu` DISABLE KEYS */;
INSERT INTO `dich_vu` VALUES ('DV001','Giặt ủi',NULL,'Kg'),('DV002','Massage',NULL,'Giờ'),('DV003','Ăn sáng','Buffet ăn sáng','Suất'),('DV004','Ăn trưa','Set menu ăn trưa','Suất'),('DV005','Ăn tối','Set menu ăn tối','Suất'),('DV006','Minibar','Đồ uống trong minibar','Chai/Lon'),('DV007','Spa','Dịch vụ spa cao cấp','Giờ'),('DV008','Karaoke','Phòng karaoke','Giờ'),('DV009','Gym','Phòng tập gym','Ngày'),('DV010','Bể bơi','Bể bới ngoài trời','Ngày');
/*!40000 ALTER TABLE `dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doiphong`
--

DROP TABLE IF EXISTS `doiphong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doiphong` (
  `ID_CT_PT` int NOT NULL,
  `SOPHONGMOI` varchar(10) NOT NULL,
  `NGAY_DEN` date DEFAULT NULL,
  `NGAY_DI` date DEFAULT NULL,
  `SOPHONGCU` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_CT_PT`,`SOPHONGMOI`),
  KEY `SOPHONGMOI` (`SOPHONGMOI`),
  CONSTRAINT `doiphong_ibfk_1` FOREIGN KEY (`ID_CT_PT`) REFERENCES `ct_phieu_thue` (`ID_CT_PT`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doiphong_ibfk_2` FOREIGN KEY (`SOPHONGMOI`) REFERENCES `phong` (`SOPHONG`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doiphong`
--

LOCK TABLES `doiphong` WRITE;
/*!40000 ALTER TABLE `doiphong` DISABLE KEYS */;
INSERT INTO `doiphong` VALUES (5,'103','2025-08-12','2025-08-15',NULL);
/*!40000 ALTER TABLE `doiphong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gia_dich_vu`
--

DROP TABLE IF EXISTS `gia_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gia_dich_vu` (
  `ID_DV` varchar(10) NOT NULL,
  `NGAY_AP_DUNG` date NOT NULL,
  `GIA` decimal(10,2) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_DV`,`NGAY_AP_DUNG`),
  KEY `ID_DV` (`ID_DV`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `gia_dich_vu_ibfk_1` FOREIGN KEY (`ID_DV`) REFERENCES `dich_vu` (`ID_DV`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gia_dich_vu_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gia_dich_vu`
--

LOCK TABLES `gia_dich_vu` WRITE;
/*!40000 ALTER TABLE `gia_dich_vu` DISABLE KEYS */;
INSERT INTO `gia_dich_vu` VALUES ('DV001','2025-08-10',50000.00,'NV002'),('DV002','2024-01-01',300000.00,'NV001'),('DV002','2025-08-10',200000.00,'NV002'),('DV003','2024-01-01',150000.00,'NV001'),('DV004','2024-01-01',200000.00,'NV001'),('DV005','2024-01-01',350000.00,'NV001'),('DV006','2024-01-01',80000.00,'NV001'),('DV007','2024-01-01',500000.00,'NV001'),('DV008','2024-01-01',200000.00,'NV001'),('DV009','2024-01-01',100000.00,'NV001'),('DV010','2025-08-03',100000.00,'NV001');
/*!40000 ALTER TABLE `gia_dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gia_hang_phong`
--

DROP TABLE IF EXISTS `gia_hang_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gia_hang_phong` (
  `ID_HANG_PHONG` int NOT NULL,
  `NGAYAPDUNG` date NOT NULL,
  `GIA` decimal(10,2) DEFAULT NULL,
  `NGAY_THIET_LAP` date DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_HANG_PHONG`,`NGAYAPDUNG`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `gia_hang_phong_ibfk_1` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gia_hang_phong_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gia_hang_phong`
--

LOCK TABLES `gia_hang_phong` WRITE;
/*!40000 ALTER TABLE `gia_hang_phong` DISABLE KEYS */;
INSERT INTO `gia_hang_phong` VALUES (1,'2025-01-01',800000.00,'2024-12-15','NV001'),(2,'2025-01-01',1000000.00,'2024-12-15','NV001'),(3,'2025-01-01',1200000.00,'2024-12-15','NV001'),(4,'2025-01-01',1300000.00,'2024-12-15','NV001'),(5,'2025-01-01',1800000.00,'2024-12-15','NV001'),(6,'2025-01-01',1700000.00,'2024-12-15','NV001'),(7,'2025-01-01',2500000.00,'2024-12-15','NV001'),(8,'2025-01-01',5000000.00,'2024-12-15','NV001');
/*!40000 ALTER TABLE `gia_hang_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giaphuthu`
--

DROP TABLE IF EXISTS `giaphuthu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giaphuthu` (
  `ID_PHU_THU` varchar(10) NOT NULL,
  `NGAY_AP_DUNG` date NOT NULL,
  `GIA` decimal(10,2) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_PHU_THU`,`NGAY_AP_DUNG`),
  KEY `ID_PHU_THU` (`ID_PHU_THU`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `giaphuthu_ibfk_1` FOREIGN KEY (`ID_PHU_THU`) REFERENCES `phu_thu` (`ID_PHU_THU`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `giaphuthu_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giaphuthu`
--

LOCK TABLES `giaphuthu` WRITE;
/*!40000 ALTER TABLE `giaphuthu` DISABLE KEYS */;
INSERT INTO `giaphuthu` VALUES ('PT001','2025-08-08',400000.00,NULL),('PT002','2024-01-01',500000.00,'NV001'),('PT003','2025-08-03',50000.00,NULL),('PT004','2025-01-01',200000.00,NULL),('PT005','2025-01-01',400000.00,NULL),('PT006','2025-01-01',500000.00,NULL),('PT007','2025-01-01',1000000.00,NULL),('PT008','2025-01-01',900000.00,NULL),('PT009','2025-01-01',1700000.00,NULL),('PT010','2025-01-01',4200000.00,NULL),('PT011','2025-01-01',200000.00,NULL),('PT012','2025-01-01',300000.00,NULL),('PT013','2025-01-01',800000.00,NULL),('PT014','2025-01-01',700000.00,NULL),('PT015','2025-01-01',1500000.00,NULL),('PT016','2025-01-01',4000000.00,NULL),('PT017','2025-01-01',100000.00,NULL),('PT018','2025-01-01',600000.00,NULL),('PT019','2025-01-01',500000.00,NULL),('PT020','2025-01-01',1300000.00,NULL),('PT021','2025-01-01',3800000.00,NULL),('PT022','2025-01-01',500000.00,NULL),('PT023','2025-01-01',400000.00,NULL),('PT024','2025-01-01',1200000.00,NULL),('PT025','2025-01-01',3700000.00,NULL),('PT027','2025-01-01',700000.00,NULL),('PT028','2025-01-01',3200000.00,NULL),('PT029','2025-01-01',800000.00,NULL),('PT030','2025-01-01',3300000.00,NULL),('PT031','2025-01-01',2500000.00,NULL);
/*!40000 ALTER TABLE `giaphuthu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hang_phong`
--

DROP TABLE IF EXISTS `hang_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hang_phong` (
  `ID_HANG_PHONG` int NOT NULL AUTO_INCREMENT,
  `ID_KP` varchar(10) DEFAULT NULL,
  `ID_LP` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_HANG_PHONG`),
  KEY `ID_KP` (`ID_KP`),
  KEY `ID_LP` (`ID_LP`),
  CONSTRAINT `hang_phong_ibfk_1` FOREIGN KEY (`ID_KP`) REFERENCES `kieu_phong` (`ID_KP`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `hang_phong_ibfk_2` FOREIGN KEY (`ID_LP`) REFERENCES `loai_phong` (`ID_LP`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_phong`
--

LOCK TABLES `hang_phong` WRITE;
/*!40000 ALTER TABLE `hang_phong` DISABLE KEYS */;
INSERT INTO `hang_phong` VALUES (1,'KP001','LP001'),(2,'KP001','LP002'),(3,'KP002','LP002'),(4,'KP002','LP003'),(5,'KP003','LP004'),(6,'KP003','LP005'),(7,'KP004','LP004'),(8,'KP005','LP004');
/*!40000 ALTER TABLE `hang_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS `hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don` (
  `ID_HD` varchar(10) NOT NULL,
  `NGAY_LAP` date DEFAULT NULL,
  `TONG_TIEN` decimal(12,2) DEFAULT NULL,
  `TRANG_THAI` varchar(20) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  `ID_PT` int DEFAULT NULL,
  `SOTIENGIAM` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`ID_HD`),
  KEY `ID_NV` (`ID_NV`),
  KEY `ID_PT` (`ID_PT`),
  CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `hoa_don_ibfk_2` FOREIGN KEY (`ID_PT`) REFERENCES `phieuthue` (`ID_PT`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don`
--

LOCK TABLES `hoa_don` WRITE;
/*!40000 ALTER TABLE `hoa_don` DISABLE KEYS */;
INSERT INTO `hoa_don` VALUES ('HD25080801','2025-08-08',23400000.00,'Đã thanh toán','NV002',8,NULL),('HD25081101','2025-08-11',17050000.00,'Đã thanh toán','NV002',3,NULL);
/*!40000 ALTER TABLE `hoa_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `CCCD` varchar(20) NOT NULL,
  `HO` varchar(50) DEFAULT NULL,
  `TEN` varchar(10) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `DIA_CHI` varchar(100) DEFAULT NULL,
  `MA_SO_THUE` varchar(20) DEFAULT NULL,
  `MAT_KHAU` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CCCD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES ('001234567890','Nguyễn Minh','Anh','0987654320','minhanh@gmail.com','123 Trần Hưng Đạo, Q5, TP.HCM',NULL,'password123'),('001234567891','Trần Thị','Bảo','0976543210','baotran@gmail.com','456 Lý Thường Kiệt, Q10, TP.HCM',NULL,'password123'),('001234567892','Lê Văn','Cường','0965432109','cuongle@gmail.com','789 Nguyễn Thị Minh Khai, Q3, TP.HCM',NULL,'password123'),('001234567893','Phạm','Thị Dung','0954321098','dungpham@gmail.com','321 Điện Biên Phủ, Q1, TP.HCM',NULL,'password123'),('001234567894','Hoàng Văn','Em','0943210987','emhoang@gmail.com','654 Hai Bà Trưng, Q1, TP.HCM',NULL,'password123'),('001234567895','Vũ Thị','Phương','0932109876','phuongvu@gmail.com','987 Cộng Hòa, Tân Bình, TP.HCM',NULL,'password123'),('001234567896','Đặng','Văn Giang','0921098765','giangdang@gmail.com','147 Lạc Long Quân, Q11, TP.HCM',NULL,'password123'),('001234567897','Bùi','Thị Hoa','0910987654','hoabui@gmail.com','258 Phan Văn Trị, Gò Vấp, TP.HCM',NULL,'password123'),('011234567894','Hoàng ','Tôn','0443240987','ton@gmail.com','Bình Thạnh, Tp Hồ Chí MInh',NULL,NULL),('0123456789','Đào Nguyễn Duy','Tiên','0818181948','daonguyenduytien@gmail.com','HCM',NULL,'$2a$10$apuuQ21NAXL5KJUWAymdEOvj7SinmC5legajNhP/NeRdOTG7KSN4.'),('045863214568','Lê','Hảo','0819451654','haole@gmail.com','',NULL,NULL),('047203008657','Phan','Lộc','0815141948','','',NULL,NULL),('054617894512','Phùng','Mẹo','0312546879','phungmeo@gmail.com','Thủ Đức, HCM',NULL,NULL),('083203008659','Nguyễn Lê','Minh','0942365589','minh@gmail.com','Số 123, đường Ngô Quyền, quận 1, TP. Hồ Chí Minh',NULL,NULL),('123456789012','Lê','Customer','0111222333','customer@test.com','789 Đường DEF, TP.HCM',NULL,'$2a$10$apuuQ21NAXL5KJUWAymdEOvj7SinmC5legajNhP/NeRdOTG7KSN4.');
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khuyenmai`
--

DROP TABLE IF EXISTS `khuyenmai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khuyenmai` (
  `ID_KM` varchar(10) NOT NULL,
  `MO_TA_KM` varchar(100) DEFAULT NULL,
  `NGAY_BAT_DAU` date DEFAULT NULL,
  `NGAY_KET_THUC` date DEFAULT NULL,
  PRIMARY KEY (`ID_KM`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khuyenmai`
--

LOCK TABLES `khuyenmai` WRITE;
/*!40000 ALTER TABLE `khuyenmai` DISABLE KEYS */;
INSERT INTO `khuyenmai` VALUES ('KM001','Giảm giá 10% cho khách hàng thân thiết','2024-01-01','2025-12-31'),('KM002','Khuyến mãi mùa hè - Giảm 15%','2024-06-01','2025-08-31'),('KM003','Ưu đãi cuối tuần - Giảm 20%','2024-01-01','2025-12-31'),('KM004','Khuyến mãi Tết Nguyên Đán','2024-02-08','2025-02-18'),('KM005','Ưu đãi đặt phòng sớm - Giảm 25%','2024-01-01','2025-12-31'),('KM006','Giảm giá 50% cho khách ở trong ngày','2025-01-01','2030-12-31');
/*!40000 ALTER TABLE `khuyenmai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kieu_phong`
--

DROP TABLE IF EXISTS `kieu_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kieu_phong` (
  `ID_KP` varchar(10) NOT NULL,
  `TEN_KP` varchar(50) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  `SO_LUONG_KHACH` int DEFAULT NULL,
  PRIMARY KEY (`ID_KP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kieu_phong`
--

LOCK TABLES `kieu_phong` WRITE;
/*!40000 ALTER TABLE `kieu_phong` DISABLE KEYS */;
INSERT INTO `kieu_phong` VALUES ('KP001','Standard','Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản',2),('KP002','Superior','Phòng cao cấp với view đẹp và không gian rộng rãi',2),('KP003','Deluxe','Phòng sang trọng với nội thất cao cấp',3),('KP004','Suite','Phòng suite với phòng khách riêng biệt',4),('KP005','Presidential','Phòng tổng thống với dịch vụ VIP',6);
/*!40000 ALTER TABLE `kieu_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_phong`
--

DROP TABLE IF EXISTS `loai_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_phong` (
  `ID_LP` varchar(10) NOT NULL,
  `TEN_LP` varchar(50) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_LP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_phong`
--

LOCK TABLES `loai_phong` WRITE;
/*!40000 ALTER TABLE `loai_phong` DISABLE KEYS */;
INSERT INTO `loai_phong` VALUES ('LP001','Single Bed','Phòng giường đơn'),('LP002','Double Bed','Phòng giường đôi'),('LP003','Twin Bed','Phòng hai giường đơn'),('LP004','King Bed','Phòng giường King size'),('LP005','Queen Bed','Phòng giường Queen size');
/*!40000 ALTER TABLE `loai_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `ID_NV` varchar(10) NOT NULL,
  `HO` varchar(50) DEFAULT NULL,
  `TEN` varchar(10) DEFAULT NULL,
  `PHAI` varchar(10) DEFAULT NULL,
  `NGAY_SINH` date DEFAULT NULL,
  `DIA_CHI` varchar(100) DEFAULT NULL,
  `SDT` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `HINH` varchar(100) DEFAULT NULL,
  `USERNAME` varchar(50) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `ID_BP` varchar(10) DEFAULT NULL,
  `ID_NQ` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_NV`),
  KEY `ID_BP` (`ID_BP`),
  KEY `idx_nhan_vien_id_nq` (`ID_NQ`),
  CONSTRAINT `fk_nhan_vien_id_nq` FOREIGN KEY (`ID_NQ`) REFERENCES `nhom_quyen` (`ID_NQ`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`ID_BP`) REFERENCES `bo_phan` (`ID_BP`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES ('NV001','Nguyễn Văn','An','Nam','1985-03-15','123 Lê Lợi, Q1, TP.HCM','0901234567','admin@hotel.com','','admin','$2a$12$e9JrrQZQEeXtL6CHH2d1Vu7n8P5KvO7PXX/FmoGKf4v.fF9OeTT1C','BP001','NQ001'),('NV002','Trần Thị','Bình','Nữ','1990-07-22','456 Nguyễn Hu, Q1, TP.HCM','0912345678','letan1@hotel.com',NULL,'letan1','$2a$10$DxWz7iimONrJur1yEkqR0e2DpJoPlqYbV5VGfEUCd6K0OIsENzwzy',NULL,NULL),('NV003','Lê Văn','Cường','Nam','1988-11-10','789 Đồng Khởi, Q1, TP.HCM','0923456789','letan2@hotel.com','','letan2','$2a$12$e9JrrQZQEeXtL6CHH2d1Vu7n8P5KvO7PXX/FmoGKf4v.fF9OeTT1C','BP002','NQ003');
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhom_quyen`
--

DROP TABLE IF EXISTS `nhom_quyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhom_quyen` (
  `ID_NQ` varchar(10) NOT NULL,
  `TEN_NQ` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_NQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhom_quyen`
--

LOCK TABLES `nhom_quyen` WRITE;
/*!40000 ALTER TABLE `nhom_quyen` DISABLE KEYS */;
INSERT INTO `nhom_quyen` VALUES ('NQ001','Quản trị viên'),('NQ002','Quản lý'),('NQ003','Nhân viên lễ tân'),('NQ004','Nhân viên housekeeping'),('NQ005','Nhân viên bảo vệ'),('NQ006','Nhân viên kế toán');
/*!40000 ALTER TABLE `nhom_quyen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieudat`
--

DROP TABLE IF EXISTS `phieudat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieudat` (
  `ID_PD` int NOT NULL AUTO_INCREMENT,
  `NGAY_DAT` date DEFAULT NULL,
  `NGAY_BD_THUE` date DEFAULT NULL,
  `NGAY_DI` date DEFAULT NULL,
  `TRANG_THAI` varchar(20) DEFAULT NULL,
  `SO_TIEN_COC` decimal(10,2) DEFAULT NULL,
  `CCCD` varchar(20) DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`ID_PD`),
  KEY `CMND` (`CCCD`),
  KEY `ID_NV` (`ID_NV`),
  CONSTRAINT `phieudat_ibfk_1` FOREIGN KEY (`CCCD`) REFERENCES `khach_hang` (`CCCD`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `phieudat_ibfk_2` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieudat`
--

LOCK TABLES `phieudat` WRITE;
/*!40000 ALTER TABLE `phieudat` DISABLE KEYS */;
INSERT INTO `phieudat` VALUES (1,'2025-07-25','2025-08-06','2025-08-09','Đã xác nhận',600000.00,'001234567890','NV002'),(2,'2025-07-26','2025-08-02','2025-08-15','Đã check-out',600000.00,'001234567891','NV002'),(3,'2025-07-27','2025-08-04','2025-08-15','Đã check-in',400000.00,'001234567892','NV003'),(4,'2025-08-02','2025-08-12','2025-08-14','Đã check-in',1000000.00,'001234567893','NV002'),(5,'2025-07-29','2025-08-01','2025-08-18','Đã xác nhận',750000.00,'001234567894','NV003'),(6,'2025-08-02','2025-08-02','2025-08-13','Đã xác nhận',500000.00,'0123456789','NV002'),(11,'2025-08-10','2025-08-12','2025-08-15','Đã check-in',400000.00,'011234567894','NV002');
/*!40000 ALTER TABLE `phieudat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieuthue`
--

DROP TABLE IF EXISTS `phieuthue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieuthue` (
  `ID_PT` int NOT NULL AUTO_INCREMENT,
  `NGAY_LAP` date DEFAULT NULL,
  `ID_NV` varchar(10) DEFAULT NULL,
  `CCCD` varchar(20) DEFAULT NULL,
  `ID_PD` int DEFAULT NULL,
  PRIMARY KEY (`ID_PT`),
  UNIQUE KEY `uq_phieuthue_id_pd` (`ID_PD`),
  KEY `ID_NV` (`ID_NV`),
  KEY `CMND` (`CCCD`),
  CONSTRAINT `phieuthue_ibfk_1` FOREIGN KEY (`ID_NV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `phieuthue_ibfk_2` FOREIGN KEY (`CCCD`) REFERENCES `khach_hang` (`CCCD`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `phieuthue_ibfk_3` FOREIGN KEY (`ID_PD`) REFERENCES `phieudat` (`ID_PD`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieuthue`
--

LOCK TABLES `phieuthue` WRITE;
/*!40000 ALTER TABLE `phieuthue` DISABLE KEYS */;
INSERT INTO `phieuthue` VALUES (3,'2025-08-02','NV002','001234567890',1),(4,'2025-07-01','NV002','001234567897',NULL),(5,'2025-08-02','NV002','0123456789',6),(8,'2025-08-05','NV002','047203008657',NULL),(9,'2025-08-08','NV002','045863214568',NULL),(10,'2025-08-10','NV002','001234567893',NULL),(11,'2025-08-12','NV003','001234567892',3),(12,'2025-08-12','NV002','011234567894',11),(13,'2025-08-13','NV002','001234567893',4);
/*!40000 ALTER TABLE `phieuthue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong`
--

DROP TABLE IF EXISTS `phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong` (
  `SOPHONG` varchar(10) NOT NULL,
  `TANG` int DEFAULT NULL,
  `ID_HANG_PHONG` int DEFAULT NULL,
  `ID_TT` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`SOPHONG`),
  KEY `ID_HANG_PHONG` (`ID_HANG_PHONG`),
  KEY `ID_TT` (`ID_TT`),
  CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`ID_HANG_PHONG`) REFERENCES `hang_phong` (`ID_HANG_PHONG`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `phong_ibfk_2` FOREIGN KEY (`ID_TT`) REFERENCES `trangthai` (`ID_TT`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong`
--

LOCK TABLES `phong` WRITE;
/*!40000 ALTER TABLE `phong` DISABLE KEYS */;
INSERT INTO `phong` VALUES ('101',1,1,'TT001'),('102',1,1,'TT001'),('103',1,2,'TT002'),('104',1,1,'TT002'),('105',1,4,'TT001'),('106',1,2,'TT002'),('107',1,2,'TT001'),('108',1,8,'TT001'),('201',2,3,'TT002'),('202',2,3,'TT001'),('203',2,4,'TT002'),('204',2,4,'TT002'),('205',2,3,'TT001'),('206',2,4,'TT003'),('207',2,5,'TT002'),('208',2,8,'TT001'),('301',3,5,'TT001'),('302',3,5,'TT001'),('303',3,6,'TT002'),('304',3,6,'TT003'),('305',3,2,'TT003'),('306',3,4,'TT001'),('307',3,5,'TT002'),('308',3,8,'TT004'),('401',4,7,'TT001'),('402',4,7,'TT001'),('403',4,4,'TT002'),('404',4,5,'TT002'),('405',4,6,'TT001'),('406',4,4,'TT002'),('407',4,4,'TT002'),('408',4,8,'TT001'),('501',5,8,'TT003'),('502',5,8,'TT001'),('503',5,8,'TT004'),('504',5,2,'TT002');
/*!40000 ALTER TABLE `phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phu_thu`
--

DROP TABLE IF EXISTS `phu_thu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phu_thu` (
  `ID_PHU_THU` varchar(10) NOT NULL,
  `TEN_PHU_THU` varchar(50) DEFAULT NULL,
  `LY_DO` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_PHU_THU`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phu_thu`
--

LOCK TABLES `phu_thu` WRITE;
/*!40000 ALTER TABLE `phu_thu` DISABLE KEYS */;
INSERT INTO `phu_thu` VALUES ('PT001','Thêm giường phụ',NULL),('PT002','Ở lại thêm giờ','Khách muốn ở lại thêm giờ'),('PT003','Dọn phòng thêm',NULL),('PT004','Phụ thu H1 lên H2','Chênh lệch giá hạng 1 -> 2'),('PT005','Phụ thu H1 lên H3','Chênh lệch giá hạng 1 -> 3'),('PT006','Phụ thu H1 lên H4','Chênh lệch giá hạng 1 -> 4'),('PT007','Phụ thu H1 lên H5','Chênh lệch giá hạng 1 -> 5'),('PT008','Phụ thu H1 lên H6','Chênh lệch giá hạng 1 -> 6'),('PT009','Phụ thu H1 lên H7','Chênh lệch giá hạng 1 -> 7'),('PT010','Phụ thu H1 lên H8','Chênh lệch giá hạng 1 -> 8'),('PT011','Phụ thu H2 lên H3','Chênh lệch giá hạng 2 -> 3'),('PT012','Phụ thu H2 lên H4','Chênh lệch giá hạng 2 -> 4'),('PT013','Phụ thu H2 lên H5','Chênh lệch giá hạng 2 -> 5'),('PT014','Phụ thu H2 lên H6','Chênh lệch giá hạng 2 -> 6'),('PT015','Phụ thu H2 lên H7','Chênh lệch giá hạng 2 -> 7'),('PT016','Phụ thu H2 lên H8','Chênh lệch giá hạng 2 -> 8'),('PT017','Phụ thu H3 lên H4','Chênh lệch giá hạng 3 -> 4'),('PT018','Phụ thu H3 lên H5','Chênh lệch giá hạng 3 -> 5'),('PT019','Phụ thu H3 lên H6','Chênh lệch giá hạng 3 -> 6'),('PT020','Phụ thu H3 lên H7','Chênh lệch giá hạng 3 -> 7'),('PT021','Phụ thu H3 lên H8','Chênh lệch giá hạng 3 -> 8'),('PT022','Phụ thu H4 lên H5','Chênh lệch giá hạng 4 -> 5'),('PT023','Phụ thu H4 lên H6','Chênh lệch giá hạng 4 -> 6'),('PT024','Phụ thu H4 lên H7','Chênh lệch giá hạng 4 -> 7'),('PT025','Phụ thu H4 lên H8','Chênh lệch giá hạng 4 -> 8'),('PT027','Phụ thu H5 lên H7','Chênh lệch giá hạng 5 -> 7'),('PT028','Phụ thu H5 lên H8','Chênh lệch giá hạng 5 -> 8'),('PT029','Phụ thu H6 lên H7','Chênh lệch giá hạng 6 -> 7'),('PT030','Phụ thu H6 lên H8','Chênh lệch giá hạng 6 -> 8'),('PT031','Phụ thu H7 lên H8','Chênh lệch giá hạng 7 -> 8');
/*!40000 ALTER TABLE `phu_thu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quan_ly`
--

DROP TABLE IF EXISTS `quan_ly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quan_ly` (
  `ID_BP` varchar(10) NOT NULL,
  `NGAYBDQL` date NOT NULL,
  `MANV` varchar(10) NOT NULL,
  PRIMARY KEY (`ID_BP`,`NGAYBDQL`),
  KEY `MANV` (`MANV`),
  CONSTRAINT `quan_ly_ibfk_1` FOREIGN KEY (`ID_BP`) REFERENCES `bo_phan` (`ID_BP`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `quan_ly_ibfk_2` FOREIGN KEY (`MANV`) REFERENCES `nhan_vien` (`ID_NV`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quan_ly`
--

LOCK TABLES `quan_ly` WRITE;
/*!40000 ALTER TABLE `quan_ly` DISABLE KEYS */;
/*!40000 ALTER TABLE `quan_ly` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiennghi`
--

DROP TABLE IF EXISTS `tiennghi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiennghi` (
  `ID_TN` varchar(10) NOT NULL,
  `TEN_TN` varchar(50) DEFAULT NULL,
  `ICON` varchar(100) DEFAULT NULL,
  `MO_TA` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_TN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiennghi`
--

LOCK TABLES `tiennghi` WRITE;
/*!40000 ALTER TABLE `tiennghi` DISABLE KEYS */;
INSERT INTO `tiennghi` VALUES ('TN001','WiFi miễn phí','wifi','Internet tốc độ cao'),('TN002','Điều hòa','ac','Máy lạnh 2 chiều'),('TN003','TV màn hình phẳng','tv','Smart TV 55 inch'),('TN004','Tủ lạnh mini','fridge','Minibar đầy đủ'),('TN005','Két an toàn','safe','Két sắt điện tử'),('TN006','Bàn làm việc','desk','Bàn làm việc ergonomic'),('TN007','Phòng tắm riêng','bathroom','Phòng tắm đầy đủ tiện nghi'),('TN008','Máy sấy tóc','hairdryer','Máy sấy tóc công suất cao'),('TN009','Dép đi trong phòng','slippers','Dép cotton cao cấp'),('TN010','Áo choàng tắm','bathrobe','Áo choàng cotton 100%');
/*!40000 ALTER TABLE `tiennghi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trangthai`
--

DROP TABLE IF EXISTS `trangthai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trangthai` (
  `ID_TT` varchar(10) NOT NULL,
  `TEN_TRANG_THAI` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_TT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trangthai`
--

LOCK TABLES `trangthai` WRITE;
/*!40000 ALTER TABLE `trangthai` DISABLE KEYS */;
INSERT INTO `trangthai` VALUES ('TT001','Trống'),('TT002','Đã có khách'),('TT003','Đang dọn dẹp'),('TT004','Đang bảo trì'),('TT005','Đã đặt');
/*!40000 ALTER TABLE `trangthai` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-14  0:02:38
