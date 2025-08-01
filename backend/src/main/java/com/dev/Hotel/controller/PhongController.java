package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.Phong;
import com.dev.Hotel.service.interfac.IPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/phong")
public class PhongController {
    
    @Autowired
    private IPhongService phongService;
    
    @GetMapping("/all")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getAllPhong() {
        Response response = phongService.getAllPhong();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/get-by-id/{soPhong}")
   // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getPhongById(@PathVariable("soPhong") String soPhong) {
        Response response = phongService.getPhongById(soPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PostMapping("/create")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> createPhong(@RequestBody Phong phong) {
        Response response = phongService.createPhong(phong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PutMapping("/update/{soPhong}")
   // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updatePhong(@PathVariable("soPhong") String soPhong, @RequestBody Phong phong) {
        Response response = phongService.updatePhong(soPhong, phong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @DeleteMapping("/delete/{soPhong}")
  //  @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deletePhong(@PathVariable("soPhong") String soPhong) {
        Response response = phongService.deletePhong(soPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/available")
    public ResponseEntity<Response> getAvailableRooms() {
        Response response = phongService.getAvailableRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/occupied")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getOccupiedRooms() {
        Response response = phongService.getOccupiedRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/maintenance")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getMaintenanceRooms() {
        Response response = phongService.getMaintenanceRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/cleaning")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getCleaningRooms() {
        Response response = phongService.getCleaningRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/available-by-date")
    public ResponseEntity<Response> getAvailableRoomsByDateRange(
            @RequestParam("checkIn") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam("checkOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        Response response = phongService.getAvailableRoomsByDateRange(checkIn, checkOut);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/by-hang-phong/{idHangPhong}")
   // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getPhongByHangPhong(@PathVariable("idHangPhong") Integer idHangPhong) {
        Response response = phongService.getPhongByHangPhong(idHangPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/by-tang/{tang}")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getPhongByTang(@PathVariable("tang") Integer tang) {
        Response response = phongService.getPhongByTang(tang);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/by-trang-thai/{idTrangThai}")
    //PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getPhongByTrangThai(@PathVariable("idTrangThai") String idTrangThai) {
        Response response = phongService.getPhongByTrangThai(idTrangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PutMapping("/update-status/{soPhong}")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> updateRoomStatus(
            @PathVariable("soPhong") String soPhong,
            @RequestParam("idTrangThai") String idTrangThai) {
        Response response = phongService.updateRoomStatus(soPhong, idTrangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/by-type/{idKieuPhong}")
    public ResponseEntity<Response> getRoomsByType(@PathVariable("idKieuPhong") String idKieuPhong) {
        Response response = phongService.getRoomsByType(idKieuPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/by-category/{idLoaiPhong}")
    public ResponseEntity<Response> getRoomsByCategory(@PathVariable("idLoaiPhong") String idLoaiPhong) {
        Response response = phongService.getRoomsByCategory(idLoaiPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Response> searchRooms(@RequestParam("keyword") String keyword) {
        Response response = phongService.searchRooms(keyword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/filter")
    //@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> filterRooms(
            @RequestParam(value = "tang", required = false) Integer tang,
            @RequestParam(value = "idHangPhong", required = false) String idHangPhong,
            @RequestParam(value = "idTrangThai", required = false) String idTrangThai) {
        Response response = phongService.filterRooms(tang, idHangPhong, idTrangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("/check-availability/{soPhong}")
    public ResponseEntity<Response> checkRoomAvailability(
            @PathVariable("soPhong") String soPhong,
            @RequestParam("checkIn") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam("checkOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        Response response = phongService.checkRoomAvailability(soPhong, checkIn, checkOut);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
