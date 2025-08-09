import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomService } from '../../services/roomService';
import { Calendar, Users, Home, Star } from 'lucide-react';

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [kieuPhong, setKieuPhong] = useState('');
  const [hangPhong, setHangPhong] = useState('');
  const [guests, setGuests] = useState(1);
  const [kieuPhongList, setKieuPhongList] = useState([]);
  const [hangPhongList, setHangPhongList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKieuPhong();
    fetchHangPhong();
  }, []);

  const fetchKieuPhong = async () => {
    try {
      const response = await roomService.getAllRoomTypes();
      if (response.statusCode === 200) {
        setKieuPhongList(response.kieuPhongList || []);
      }
    } catch (error) {
      console.error('Error fetching kieu phong:', error);
      // Fallback data
      setKieuPhongList([
        { idKp: 'STD', tenKp: 'Standard' },
        { idKp: 'DLX', tenKp: 'Deluxe' },
        { idKp: 'SUT', tenKp: 'Suite' },
        { idKp: 'VIP', tenKp: 'VIP' }
      ]);
    }
  };

  const fetchHangPhong = async () => {
    try {
      // Sử dụng API để lấy danh sách hạng phòng
      const response = await roomService.getAllRooms();
      if (response.statusCode === 200 && response.phongList) {
        // Extract unique hang phong from rooms
        const uniqueHangPhong = [];
        const seenHangPhong = new Set();

        response.phongList.forEach(room => {
          if (room.idHangPhong && !seenHangPhong.has(room.idHangPhong)) {
            seenHangPhong.add(room.idHangPhong);
            uniqueHangPhong.push({
              idHangPhong: room.idHangPhong,
              giaPhong: room.giaPhong || 0
            });
          }
        });

        setHangPhongList(uniqueHangPhong);
      }
    } catch (error) {
      console.error('Error fetching hang phong:', error);
      // Fallback data
      setHangPhongList([
        { idHangPhong: 1, giaPhong: 500000 },
        { idHangPhong: 2, giaPhong: 800000 },
        { idHangPhong: 3, giaPhong: 1200000 },
        { idHangPhong: 4, giaPhong: 2000000 }
      ]);
    }
  };

  /**This methods is going to be used to show errors */
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  /**THis is going to be used to fetch avaailabe rooms from database base on seach data that'll be passed in */
  const handleInternalSearch = async () => {
    if (!startDate || !endDate) {
      showError('Vui lòng chọn ngày nhận phòng và trả phòng');
      return false;
    }

    if (startDate >= endDate) {
      showError('Ngày trả phòng phải sau ngày nhận phòng');
      return false;
    }

    try {
      // Convert startDate to the desired format
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

      // Call the API to fetch available rooms
      const response = await roomService.getAvailableRoomsByDateRange(formattedStartDate, formattedEndDate);

      // Check if the response is successful
      if (response.statusCode === 200) {
        let filteredRooms = response.phongList || [];

        // Apply filters
        if (kieuPhong) {
          filteredRooms = filteredRooms.filter(room => room.idKp === kieuPhong);
        }

        if (hangPhong) {
          filteredRooms = filteredRooms.filter(room => room.idHangPhong === parseInt(hangPhong));
        }

        if (guests > 1) {
          filteredRooms = filteredRooms.filter(room => room.soLuongKhachO >= guests);
        }

        if (filteredRooms.length === 0) {
          showError('Không có phòng trống phù hợp với tiêu chí tìm kiếm.');
          return;
        }

        handleSearchResult(filteredRooms);
        setError('');
      }
    } catch (error) {
      showError("Có lỗi xảy ra: " + (error.message || 'Không thể tìm kiếm phòng'));
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Check-in Date */}
        <div className="lg:col-span-1">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Nhận phòng</span>
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày"
            className="w-full px-4 py-3 border text-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            minDate={new Date()}
          />
        </div>

        {/* Check-out Date */}
        <div className="lg:col-span-1">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Trả phòng</span>
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày"
            className="w-full px-4 py-3 border text-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            minDate={startDate || new Date()}
          />
        </div>

        {/* Room Type (Kieu Phong) */}
        <div className="lg:col-span-1">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Kiểu phòng</span>
          </label>
          <select
            value={kieuPhong}
            onChange={(e) => setKieuPhong(e.target.value)}
            className="w-full px-4 py-3 border text-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Tất cả kiểu phòng</option>
            {kieuPhongList.map((kp) => (
              <option key={kp.idKp} value={kp.idKp}>
                {kp.tenKp}
              </option>
            ))}
          </select>
        </div>

        {/* Room Category (Hang Phong) */}
        <div className="lg:col-span-1">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Loại phòng</span>
          </label>
          <select
            value={hangPhong}
            onChange={(e) => setHangPhong(e.target.value)}
            className="w-full px-4 py-3 border text-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Tất cả loại phòng</option>
            {hangPhongList.map((hp) => (
              <option key={hp.idHangPhong} value={hp.idHangPhong}>
                Loại {hp.idHangPhong} - {hp.giaPhong?.toLocaleString('vi-VN')}₫/đêm
              </option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div className="lg:col-span-1">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Số khách</span>
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full px-4 py-3 border text-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'khách' : 'khách'}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1 flex items-end">
          <button
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            onClick={handleInternalSearch}
          >
            <span>Tìm Phòng</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters - Mobile Layout */}
      <div className="lg:hidden mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Kiểu phòng</span>
          </label>
          <select
            value={kieuPhong}
            onChange={(e) => setKieuPhong(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Tất cả kiểu phòng</option>
            {kieuPhongList.map((kp) => (
              <option key={kp.idKp} value={kp.idKp}>
                {kp.tenKp}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Star className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">Loại phòng</span>
          </label>
          <select
            value={hangPhong}
            onChange={(e) => setHangPhong(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Tất cả loại phòng</option>
            {hangPhongList.map((hp) => (
              <option key={hp.idHangPhong} value={hp.idHangPhong}>
                Loại {hp.idHangPhong} - {hp.giaPhong?.toLocaleString('vi-VN')}₫/đêm
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomSearch;
