import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomService } from '../../services/roomService';
import { formatDateToYMD } from '../../utils/dateUtils';

// CSS cho dual range slider
const sliderStyles = `
  .dual-range-slider {
    position: relative;
    height: 8px;
    background: linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%);
    border-radius: 4px;
    margin: 20px 0;
    padding: 10px 0;
  }

  .dual-range-slider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    transform: translateY(-50%);
    z-index: 1;
  }

  .dual-range-slider input[type="range"] {
    position: absolute;
    width: 100%;
    height: 8px;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    pointer-events: none;
    outline: none;
    z-index: 2;
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    pointer-events: all;
    transition: all 0.2s ease;
    z-index: 3;
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb:hover {
    background: #2563EB;
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .dual-range-slider input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.2);
  }

  .dual-range-slider input[type="range"]::-moz-range-thumb {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: #3B82F6;
    cursor: pointer;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    pointer-events: all;
    transition: all 0.2s ease;
    -moz-appearance: none;
  }

  .dual-range-slider input[type="range"]::-moz-range-thumb:hover {
    background: #2563EB;
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .dual-range-slider input[type="range"]:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

  .dual-range-slider .range-min::-webkit-slider-thumb {
    background: #10B981;
  }

  .dual-range-slider .range-min::-webkit-slider-thumb:hover {
    background: #059669;
  }

  .dual-range-slider .range-min::-moz-range-thumb {
    background: #10B981;
  }

  .dual-range-slider .range-min::-moz-range-thumb:hover {
    background: #059669;
  }

  .dual-range-slider .range-max::-webkit-slider-thumb {
    background: #EF4444;
  }

  .dual-range-slider .range-max::-webkit-slider-thumb:hover {
    background: #DC2626;
  }

  .dual-range-slider .range-max::-moz-range-thumb {
    background: #EF4444;
  }

  .dual-range-slider .range-max::-moz-range-thumb:hover {
    background: #DC2626;
  }

  /* Track styling for Firefox */
  .dual-range-slider input[type="range"]::-moz-range-track {
    background: transparent;
    border: none;
    height: 8px;
  }

  /* Active range styling */
  .dual-range-slider .range-track {
    position: absolute;
    top: 50%;
    height: 8px;
    background: linear-gradient(to right, #3B82F6, #10B981);
    border-radius: 4px;
    transform: translateY(-50%);
    z-index: 2;
  }
`;

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Giá từ 0 đến 10 triệu VND
  const [error, setError] = useState('');

  // Inject CSS styles for dual range slider
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = sliderStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
      showError('Vui lòng chọn ngày nhận phòng và ngày trả phòng');
      return false;
    }

    if (startDate >= endDate) {
      showError('Ngày trả phòng phải sau ngày nhận phòng');
      return false;
    }

    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      showError('Ngày nhận phòng không thể là ngày trong quá khứ');
      return false;
    }

    if (priceRange[0] >= priceRange[1]) {
      showError('Khoảng giá không hợp lệ');
      return false;
    }
    try {
      // Convert startDate to the desired format (avoid timezone issues)
      const formattedStartDate = formatDateToYMD(startDate);
      const formattedEndDate = formatDateToYMD(endDate);

      // Debug: Log price range values
      console.log('Price range being sent to API:', {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        checkIn: formattedStartDate,
        checkOut: formattedEndDate
      });

      // Call the API to fetch available rooms by price range
      const response = await roomService.searchRoomsByPriceRange(
        formattedStartDate,
        formattedEndDate,
        priceRange[0],
        priceRange[1]
      );

      // Check if the response is successful
      if (response.statusCode === 200) {
        // Debug: Log the actual data received from API
        console.log('API Response Data:', response.availableRoomsByHangPhongList);

        if (response.availableRoomsByHangPhongList && response.availableRoomsByHangPhongList.length === 0) {
          showError('Không có phòng trống trong khoảng thời gian và mức giá này.');
          return
        }
        handleSearchResult(response.availableRoomsByHangPhongList || [], {
          startDate,
          endDate,
          priceRange
        });
        setError('');
      }
    } catch (error) {
      showError("Có lỗi xảy ra: " + (error.message || 'Không thể tìm kiếm phòng'));
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhận phòng</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày nhận phòng"
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày trả phòng</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày trả phòng"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng giá: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </label>
          <div className="px-2">

            <div className="dual-range-slider">
              <input
                type="range"
                min="0"
                max="10000000"
                step="500000"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin < priceRange[1]) {
                    setPriceRange([newMin, priceRange[1]]);
                  }
                }}
                className="range-min"
              />
              <input
                type="range"
                min="0"
                max="10000000"
                step="500000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  console.log('Max slider changed to:', newMax);
                  if (newMax > priceRange[0]) {
                    setPriceRange([priceRange[0], newMax]);
                    console.log('Updated priceRange:', [priceRange[0], newMax]);
                  }
                }}
                className="range-max"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0đ</span>
              <span>10 triệu</span>
            </div>

          </div>
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full" onClick={handleInternalSearch}>
            Tìm phòng
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );

};

export default RoomSearch;
