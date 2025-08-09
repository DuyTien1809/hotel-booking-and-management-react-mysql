import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomSearch from '../../components/common/RoomSearch'
import RoomSearchResult from '../../components/common/RoomSearchResult'
import Pagination from '../../components/common/Pagination'
import { roomService } from '../../services/roomService'
import { Search, MapPin } from 'lucide-react'

const BookingPage = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(6)
  const [searchDates, setSearchDates] = useState({
    checkIn: null,
    checkOut: null
  })

  useEffect(() => {
    fetchAvailableRooms()
  }, [])

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAvailableRooms()
      if (response.statusCode === 200) {
        setRooms(response.phongList || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchResult = (searchResults, searchData) => {
    setRooms(searchResults)
    setCurrentPage(1)

    // Lưu thông tin ngày tìm kiếm
    if (searchData) {
      setSearchDates({
        checkIn: searchData.startDate,
        checkOut: searchData.endDate
      })
    }
  }



  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Đặt phòng</h1>
          <p className="text-gray-600 mt-2">Tìm và đặt phòng phù hợp với nhu cầu của bạn</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <MapPin className="w-5 h-5" />
          <span>Hotel Booking</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm phòng</h2>
        </div>
        <RoomSearch handleSearchResult={handleSearchResult} />
      </div>


      {/* Results */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả ({rooms.length} phòng)
          </h2>
          <div className="text-sm text-gray-500">
            Hiển thị {currentRooms.length} trong tổng số {rooms.length} phòng
          </div>
        </div>

        {rooms.length > 0 ? (
          <>
            <RoomSearchResult searchResults={currentRooms} searchDates={searchDates} />
            <Pagination
              itemsPerPage={roomsPerPage}
              totalItems={rooms.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy phòng nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi tiêu chí tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage
