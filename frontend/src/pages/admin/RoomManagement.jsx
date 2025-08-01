import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Building,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { api } from '../../services/api'

const RoomManagement = () => {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(12)
  const [filters, setFilters] = useState({
    searchTerm: '',
    roomType: '',
    status: '',
    floor: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomForm, setRoomForm] = useState({
    soPhong: '',
    tang: '',
    idKieuPhong: '',
    idTrangThai: '',
    moTa: ''
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      // Gọi API để lấy danh sách phòng
      const response = await api.get('/api/phong/all')
      const roomData = response.data.phongList || []

      setRooms(roomData)
      setFilteredRooms(roomData)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...rooms]

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(room =>
        room.soPhong.toLowerCase().includes(searchLower) ||
        room.tenKp.toLowerCase().includes(searchLower) ||
        room.tenLp.toLowerCase().includes(searchLower)
      )
    }

    // Filter by room type
    if (currentFilters.roomType) {
      filtered = filtered.filter(room => room.tenKp === currentFilters.roomType)
    }

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(room => room.tenTrangThai === currentFilters.status)
    }

    // Filter by floor
    if (currentFilters.floor) {
      filtered = filtered.filter(room => room.tang.toString() === currentFilters.floor)
    }

    setFilteredRooms(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      roomType: '',
      status: '',
      floor: ''
    })
    setFilteredRooms(rooms)
    setCurrentPage(1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Trống': return 'text-green-600 bg-green-100'
      case 'Đã thuê': return 'text-blue-600 bg-blue-100'
      case 'Bảo trì': return 'text-red-600 bg-red-100'
      case 'Dọn dẹp': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Trống': return <CheckCircle className="w-4 h-4" />
      case 'Đã thuê': return <Clock className="w-4 h-4" />
      case 'Bảo trì': return <XCircle className="w-4 h-4" />
      case 'Dọn dẹp': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleAddRoom = () => {
    setRoomForm({
      soPhong: '',
      tang: '',
      idKieuPhong: '',
      idTrangThai: '1',
      moTa: ''
    })
    setShowAddModal(true)
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setRoomForm({
      soPhong: room.soPhong,
      tang: room.tang.toString(),
      idKieuPhong: room.idKieuPhong || '1',
      idTrangThai: room.idTrangThai.toString(),
      moTa: room.moTa
    })
    setShowEditModal(true)
  }

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        // TODO: Call API to delete room
        setRooms(prev => prev.filter(room => room.id !== roomId))
        setFilteredRooms(prev => prev.filter(room => room.id !== roomId))
        toast.success('Xóa phòng thành công!')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa phòng')
      }
    }
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    try {
      if (showEditModal) {
        // TODO: Call API to update room
        setRooms(prev => prev.map(room =>
          room.id === selectedRoom.id
            ? { ...room, ...roomForm, tang: parseInt(roomForm.tang) }
            : room
        ))
        toast.success('Cập nhật phòng thành công!')
      } else {
        // Gọi API để tạo phòng mới
        const response = await api.post('/api/phong/create', {
          ...roomForm,
          tang: parseInt(roomForm.tang)
        })

        if (response.data.success) {
          toast.success('Tạo phòng thành công!')
          fetchRooms() // Refresh danh sách phòng
          setShowEditModal(false)
          setRoomForm({
            soPhong: '',
            tang: '',
            maKp: '',
            maLp: '',
            maTrangThai: ''
          })
        } else {
          toast.error(response.data.message || 'Tạo phòng thất bại')
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu phòng')
    }
  }

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom)

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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý phòng</h1>
          <p className="text-gray-600 mt-2">Thêm, sửa, xóa và quản lý phòng khách sạn</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng phòng</p>
              <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Phòng trống</p>
              <p className="text-2xl font-bold text-gray-900">
                {rooms.filter(r => r.tenTrangThai === 'Trống').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã thuê</p>
              <p className="text-2xl font-bold text-gray-900">
                {rooms.filter(r => r.tenTrangThai === 'Đã thuê').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bảo trì</p>
              <p className="text-2xl font-bold text-gray-900">
                {rooms.filter(r => r.tenTrangThai === 'Bảo trì').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm và lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Số phòng, loại phòng..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Room Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại phòng
            </label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Trống">Trống</option>
              <option value="Đã thuê">Đã thuê</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Dọn dẹp">Dọn dẹp</option>
            </select>
          </div>

          {/* Floor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tầng
            </label>
            <select
              value={filters.floor}
              onChange={(e) => handleFilterChange('floor', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="1">Tầng 1</option>
              <option value="2">Tầng 2</option>
              <option value="3">Tầng 3</option>
              <option value="4">Tầng 4</option>
            </select>
          </div>

          {/* Clear Filters */}
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

      {/* Rooms Grid */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách phòng ({filteredRooms.length})
          </h2>
        </div>

        {filteredRooms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentRooms.map((room) => (
                <div key={room.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Phòng {room.soPhong}
                      </h3>
                      <p className="text-sm text-gray-600">Tầng {room.tang}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.tenTrangThai)}`}>
                      {getStatusIcon(room.tenTrangThai)}
                      <span className="ml-1">{room.tenTrangThai}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div><span className="font-medium">Loại:</span> {room.tenKp}</div>
                    <div><span className="font-medium">Giường:</span> {room.tenLp}</div>
                    <div><span className="font-medium">Diện tích:</span> {room.dienTich}m²</div>
                    <div><span className="font-medium">Giá:</span> {room.giaPhong?.toLocaleString('vi-VN')} VNĐ</div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Xem
                    </button>
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="flex-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              itemsPerPage={roomsPerPage}
              totalItems={filteredRooms.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có phòng nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy phòng nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Room Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedRoom(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số phòng
                  </label>
                  <input
                    type="text"
                    value={roomForm.soPhong}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, soPhong: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tầng
                  </label>
                  <select
                    value={roomForm.tang}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, tang: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Chọn tầng</option>
                    <option value="1">Tầng 1</option>
                    <option value="2">Tầng 2</option>
                    <option value="3">Tầng 3</option>
                    <option value="4">Tầng 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={roomForm.idTrangThai}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, idTrangThai: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="1">Trống</option>
                    <option value="2">Đã thuê</option>
                    <option value="3">Bảo trì</option>
                    <option value="4">Dọn dẹp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={roomForm.moTa}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, moTa: e.target.value }))}
                    className="input min-h-[80px]"
                    placeholder="Mô tả về phòng..."
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedRoom(null)
                    }}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {showEditModal ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomManagement
