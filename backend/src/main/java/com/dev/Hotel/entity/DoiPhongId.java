package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class DoiPhongId implements Serializable {

    @Column(name = "ID_CT_PT")
    private Integer idCtPt;

    @Column(name = "SOPHONGMOI")
    private String soPhongMoi;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DoiPhongId that = (DoiPhongId) o;
        return Objects.equals(idCtPt, that.idCtPt) &&
               Objects.equals(soPhongMoi, that.soPhongMoi);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCtPt, soPhongMoi);
    }
}