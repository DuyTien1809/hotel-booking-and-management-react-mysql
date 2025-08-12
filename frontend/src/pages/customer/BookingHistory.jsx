import React, { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const BookingHistory = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    if (user) {
      fetchBookingHistory()
    }
  }, [user])

  const fetchBookingHistory = async () => {
    try {
      setLoading(true)

      console.log('Current user data:', user)

      // Kiểm tra user và lấy CCCD với nhiều fallback
      if (!user) {
        console.error('User not found')
        setLoading(false)
        return
      }

      // Thử nhiều field có thể chứa CCCD
      const userCCCD = user.cccd || user.id || user.maKhachHang || user.userId

      if (!userCCCD) {
        console.error('CCCD not found in user data:', user)
        setLoading(false)
        return
      }

      console.log('Fetching booking history for CCCD:', userCCCD)

      // Gọi API với CCCD của user
      const response = await api.get(`/api/phieu-dat/khach-hang/${userCCCD}`)
      console.log('API response:', response.data)

      const bookingData = response.data.phieuDatList || []
      console.log('Booking data:', bookingData)
      console.log('First booking sample:', bookingData[0])

      // Debug: Log all field names in first booking
      if (bookingData[0]) {
        console.log('Available fields in booking:', Object.keys(bookingData[0]))
        console.log('Status value:', bookingData[0].trangThai)
        console.log('Room info:', {
          tenKp: bookingData[0].tenKp,
          tenLp: bookingData[0].tenLp,
          idHangPhong: bookingData[0].idHangPhong
        })
        console.log('Date info:', {
          ngayDat: bookingData[0].ngayDat,
          ngayBdThue: bookingData[0].ngayBdThue,
          ngayDi: bookingData[0].ngayDi
        })
        console.log('Money info:', {
          soTienCoc: bookingData[0].soTienCoc
        })
      }

      setBookings(bookingData)
      setFilteredBookings(bookingData)
    } catch (error) {
      console.error('Error fetching booking history:', error)
      console.error('Error details:', error.response?.data || error.message)

      // Nếu lỗi 403, có thể do authentication
      if (error.response?.status === 403) {
        console.error('Access denied - check authentication')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'Đã hoàn thành':
      case 'Hoàn thành':
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'confirmed':
      case 'Đã xác nhận':
      case 'Xác nhận':
      case 'CONFIRMED':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
      case 'Chờ xác nhận':
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
      case 'Đã hủy':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
      case 'COMPLETED':
      case 'Hoàn thành':
        return 'Đã hoàn thành'
      case 'confirmed':
      case 'CONFIRMED':
      case 'Xác nhận':
        return 'Xác nhận'
      case 'pending':
      case 'PENDING':
      case 'Chờ xác nhận':
        return 'Chờ xác nhận'
      case 'cancelled':
      case 'CANCELLED':
      case 'Đã hủy':
        return 'Đã hủy'
      default:
        return status || 'Không xác định'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'COMPLETED':
      case 'Đã hoàn thành':
      case 'Hoàn thành':
        return <CheckCircle className="w-4 h-4" />
      case 'confirmed':
      case 'CONFIRMED':
      case 'Đã xác nhận':
      case 'Xác nhận':
        return <Calendar className="w-4 h-4" />
      case 'pending':
      case 'PENDING':
      case 'Chờ xác nhận':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
      case 'CANCELLED':
      case 'Đã hủy':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    applyFilters(status, dateFilter)
  }

  const handleDateFilter = (date) => {
    setDateFilter(date)
    applyFilters(statusFilter, date)
  }

  const applyFilters = (status, date) => {
    let filtered = [...bookings]

    if (status) {
      filtered = filtered.filter(booking => booking.status === status)
    }

    if (date) {
      const filterDate = new Date(date)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate >= filterDate
      })
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setStatusFilter('')
    setDateFilter('')
    setFilteredBookings(bookings)
    setCurrentPage(1)
  }

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Kiểm tra user data
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Vui lòng đăng nhập để xem lịch sử đặt phòng</p>
      </div>
    )
  }

  const userCCCD = user.cccd || user.id || user.maKhachHang || user.userId
  if (!userCCCD) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không tìm thấy thông tin khách hàng</p>
        <p className="text-sm text-gray-500 mt-2">Vui lòng liên hệ hỗ trợ</p>
        <div className="mt-4">
          <p className="text-xs text-gray-400">Debug: User data</p>
          <pre className="text-xs text-gray-400 mt-2">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử đặt phòng</h1>
        <p className="text-gray-600 mt-2">Xem tất cả đặt phòng đã thực hiện</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả ({filteredBookings.length} đặt phòng)
          </h2>
        </div>

        {filteredBookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đặt phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBookings.map((booking) => (
                    <tr key={booking.idPd || booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.idPd || booking.maPhieuThue || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.ngayDat || booking.createdAt || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.tenLp || booking.roomNumber || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.tenKp || booking.roomType || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.ngayBdThue || booking.checkIn || 'N/A'} - {booking.ngayDi || booking.checkOut || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.trangThai)}`}>
                          {getStatusIcon(booking.trangThai)}
                          <span className="ml-1">{getStatusText(booking.trangThai)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(booking.soTienCoc || booking.total || 0).toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={bookingsPerPage}
              totalItems={filteredBookings.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đặt phòng nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa có đặt phòng nào hoặc thử thay đổi bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingHistory
