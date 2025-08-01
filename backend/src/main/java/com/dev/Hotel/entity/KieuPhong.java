package com.dev.Hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "kieu_phong")
public class KieuPhong {
    @Id
    @NotBlank(message = "ID kiểu phòng không được để trống")
    @Size(max = 10, message = "ID kiểu phòng không được quá 10 ký tự")
    @Column(name = "ID_KP")
    private String idKp;

    @NotBlank(message = "Tên kiểu phòng không được để trống")
    @Size(max = 100, message = "Tên kiểu phòng không được quá 100 ký tự")
    @Column(name = "TEN_KP")
    private String tenKp;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    @Column(name = "MO_TA")
    private String moTa;

    @Positive(message = "Số lượng khách ở phải là số dương")
    @Max(value = 20, message = "Số lượng khách ở không được quá 20")
    @Column(name = "SO_LUONG_KHACH_O")
    private Integer soLuongKhachO;
}