package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KhuyenMaiDTO {

    private String idKm;
    private String moTaKm;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
}
