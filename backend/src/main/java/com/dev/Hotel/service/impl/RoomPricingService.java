package com.dev.Hotel.service.impl;

import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class RoomPricingService {

    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    /**
     * Calculate total price for a room category over a date range
     * Uses the new logic: for each night, find the latest applicable price before that date
     * 
     * @param idHangPhong Room category ID
     * @param checkIn Check-in date
     * @param checkOut Check-out date
     * @return Total price for the stay
     */
    public BigDecimal calculateTotalPriceForDateRange(Integer idHangPhong, LocalDate checkIn, LocalDate checkOut) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        LocalDate currentDate = checkIn;
        
        while (currentDate.isBefore(checkOut)) {
            BigDecimal priceForNight = getPriceForDate(idHangPhong, currentDate);
            totalPrice = totalPrice.add(priceForNight);
            currentDate = currentDate.plusDays(1);
        }
        
        return totalPrice;
    }

    /**
     * Get the applicable price for a specific date
     * Finds the latest price with NGAYAPDUNG <= the given date
     * 
     * @param idHangPhong Room category ID
     * @param date The date to get price for
     * @return Price for that date
     */
    public BigDecimal getPriceForDate(Integer idHangPhong, LocalDate date) {
        Optional<GiaHangPhong> applicablePrice = giaHangPhongRepository.findLatestPriceByHangPhong(idHangPhong, date);
        
        if (applicablePrice.isPresent()) {
            return applicablePrice.get().getGia();
        } else {
            // Return default price if no price found
            return BigDecimal.valueOf(500000);
        }
    }

    /**
     * Get current price for a room category (price applicable today)
     * 
     * @param idHangPhong Room category ID
     * @return Current price
     */
    public BigDecimal getCurrentPrice(Integer idHangPhong) {
        return getPriceForDate(idHangPhong, LocalDate.now());
    }

    /**
     * Calculate average price per night for a date range
     * 
     * @param idHangPhong Room category ID
     * @param checkIn Check-in date
     * @param checkOut Check-out date
     * @return Average price per night
     */
    public BigDecimal getAveragePricePerNight(Integer idHangPhong, LocalDate checkIn, LocalDate checkOut) {
        BigDecimal totalPrice = calculateTotalPriceForDateRange(idHangPhong, checkIn, checkOut);
        long numberOfNights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
        
        if (numberOfNights > 0) {
            return totalPrice.divide(BigDecimal.valueOf(numberOfNights), 2, java.math.RoundingMode.HALF_UP);
        } else {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Check if there are any price changes within a date range
     * 
     * @param idHangPhong Room category ID
     * @param checkIn Check-in date
     * @param checkOut Check-out date
     * @return true if prices change during the stay
     */
    public boolean hasPriceChanges(Integer idHangPhong, LocalDate checkIn, LocalDate checkOut) {
        BigDecimal firstNightPrice = getPriceForDate(idHangPhong, checkIn);
        LocalDate currentDate = checkIn.plusDays(1);
        
        while (currentDate.isBefore(checkOut)) {
            BigDecimal currentNightPrice = getPriceForDate(idHangPhong, currentDate);
            if (!firstNightPrice.equals(currentNightPrice)) {
                return true;
            }
            currentDate = currentDate.plusDays(1);
        }
        
        return false;
    }
}
