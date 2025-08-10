import React, { useState } from 'react';
import { Users, Wifi, Car, Coffee, Star } from 'lucide-react';
import BookingModal from '../booking/BookingModal';

const RoomSearchResult = ({ searchResults, searchDates }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Handle book room
  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Render tiện nghi với icon
  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) {
      return (
        <div className="mt-2">
          <span className="text-sm text-gray-400">Chưa có thông tin tiện nghi</span>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tiện nghi:</h4>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <span key={index} className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {getAmenityIcon(amenity.icon)}
              {amenity.tenTn}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Lấy icon cho tiện nghi
  const getAmenityIcon = (iconName) => {
    const iconMap = {
      'wifi': <Wifi size={14} />,
      'parking': <Car size={14} />,
      'coffee': <Coffee size={14} />,
      'star': <Star size={14} />
    };
    return iconMap[iconName] || <Star size={14} />;
  };

  // Render khuyến mãi
  const renderPromotions = (promotions) => {
    if (!promotions || promotions.length === 0) return null;

    return (
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Khuyến mãi:</h4>
        {promotions.map((promotion, index) => (
          <div key={index} className="bg-red-50 border border-red-200 rounded p-2 mb-1">
            <span className="text-red-600 font-medium text-sm">
              🎉 {promotion.moTaKm}
              {promotion.phanTramGiam && ` - Giảm ${promotion.phanTramGiam}%`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có kết quả tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết quả tìm kiếm</h2>
      
      {searchResults.map((room, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="md:flex">
            {/* Hình ảnh */}
            <div className="md:w-1/3">
              {room.danhSachAnhUrl && room.danhSachAnhUrl.length > 0 ? (
                <img
                  src={room.danhSachAnhUrl[0]}
                  alt={`${room.tenKieuPhong} - ${room.tenLoaiPhong}`}
                  className="w-full h-48 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Không có hình ảnh</span>
                </div>
              )}
            </div>
            
            {/* Thông tin phòng */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {room.tenKieuPhong} - {room.tenLoaiPhong}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {room.moTaKieuPhong}
                    </span>
                    <span className="text-green-600 font-medium">
                      {room.soPhongTrong}/{room.tongSoPhong} phòng trống
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  {room.totalPrice && (
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(room.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-500">tổng cộng</div>
                      {room.averagePrice && (
                        <div className="text-sm text-gray-600 mt-1">
                          {formatPrice(room.averagePrice)} / đêm
                        </div>
                      )}
                    </div>
                  )}
                  {!room.totalPrice && room.giaHienTai && (
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(room.giaHienTai)}
                      </div>
                      <div className="text-sm text-gray-500">/ đêm</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mô tả */}
              <div className="mb-4">
                {room.moTaKieuPhong && (
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Kiểu phòng:</strong> {room.moTaKieuPhong}
                  </p>
                )}
                {room.moTaLoaiPhong && (
                  <p className="text-gray-600 text-sm">
                    <strong>Loại phòng:</strong> {room.moTaLoaiPhong}
                  </p>
                )}
              </div>
              
              {/* Tiện nghi */}
              {renderAmenities(room.danhSachTienNghi)}
              
              {/* Khuyến mãi */}
              {renderPromotions(room.danhSachKhuyenMai)}
              
              {/* Nút đặt phòng */}
              <div className="mt-4 flex gap-2">
                <button
                  className="btn-primary flex-1"
                  onClick={() => handleBookRoom(room)}
                >
                  Tiến hành đặt phòng
                </button>
                <button className="btn-secondary">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          searchDates={searchDates}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default RoomSearchResult;
