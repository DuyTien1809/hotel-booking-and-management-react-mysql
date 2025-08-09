package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.service.impl.HangPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hang-phong")
public class HangPhongController {

    @Autowired
    private HangPhongService hangPhongService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllHangPhong() {
        Response response = hangPhongService.getAllHangPhong();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idHangPhong}")
    public ResponseEntity<Response> getHangPhongById(@PathVariable("idHangPhong") Integer idHangPhong) {
        Response response = hangPhongService.getHangPhongById(idHangPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createHangPhong(@RequestBody HangPhong hangPhong) {
        Response response = hangPhongService.createHangPhong(hangPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idHangPhong}")
    public ResponseEntity<Response> updateHangPhong(@PathVariable("idHangPhong") Integer idHangPhong, @RequestBody HangPhong hangPhong) {
        Response response = hangPhongService.updateHangPhong(idHangPhong, hangPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idHangPhong}")
    public ResponseEntity<Response> deleteHangPhong(@PathVariable("idHangPhong") Integer idHangPhong) {
        Response response = hangPhongService.deleteHangPhong(idHangPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/by-kieu-phong/{idKp}")
    public ResponseEntity<Response> getHangPhongByKieuPhong(@PathVariable("idKp") String idKp) {
        Response response = hangPhongService.getHangPhongByKieuPhong(idKp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/by-loai-phong/{idLp}")
    public ResponseEntity<Response> getHangPhongByLoaiPhong(@PathVariable("idLp") String idLp) {
        Response response = hangPhongService.getHangPhongByLoaiPhong(idLp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/by-kieu-and-loai")
    public ResponseEntity<Response> getHangPhongByKieuAndLoai(
            @RequestParam("idKp") String idKp,
            @RequestParam("idLp") String idLp) {
        Response response = hangPhongService.getHangPhongByKieuAndLoai(idKp, idLp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/room-price")
    public ResponseEntity<Response> getRoomPriceByKieuAndLoai(
            @RequestParam("idKp") String idKp,
            @RequestParam("idLp") String idLp) {
        Response response = hangPhongService.getRoomPriceByKieuAndLoai(idKp, idLp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/available")
    public ResponseEntity<Response> getAvailableHangPhong() {
        Response response = hangPhongService.getAvailableHangPhong();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/with-available-rooms")
    public ResponseEntity<Response> getHangPhongWithAvailableRooms() {
        Response response = hangPhongService.getHangPhongWithAvailableRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Response> getHangPhongStatistics() {
        Response response = hangPhongService.getHangPhongStatistics();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchHangPhong(@RequestParam("keyword") String keyword) {
        Response response = hangPhongService.searchHangPhong(keyword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/filter")
    public ResponseEntity<Response> filterHangPhong(
            @RequestParam(value = "idKp", required = false) String idKp,
            @RequestParam(value = "idLp", required = false) String idLp) {
        Response response = hangPhongService.filterHangPhong(idKp, idLp);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
