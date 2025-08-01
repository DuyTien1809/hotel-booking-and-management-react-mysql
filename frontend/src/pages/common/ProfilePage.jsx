import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { getUserDisplayName, getRoleDisplayName } from '../../utils/userUtils'

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    diaChi: '',
    ngaySinh: '',
    gioiTinh: '',
    cccd: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)

      const endpoint = user.role === 'CUSTOMER'
        ? '/api/khachhang/profile'
        : '/api/nhanvien/profile'

      const response = await api.get(endpoint)

      if (response.data.success) {
        const profileData = response.data.data || response.data.profile || {}

        setFormData({
          hoTen: profileData.hoTen || profileData.tenNhanVien || profileData.tenKhachHang || user.hoTen || '',
          email: profileData.email || user.email || '',
          soDienThoai: profileData.soDienThoai || profileData.phone || '',
          diaChi: profileData.diaChi || profileData.address || '',
          ngaySinh: profileData.ngaySinh || profileData.dateOfBirth || '',
          gioiTinh: profileData.gioiTinh || profileData.gender || '',
          cccd: profileData.cccd || profileData.idCard || ''
        })
      } else {
        // Fallback to user context data
        setFormData({
          hoTen: user.hoTen || '',
          email: user.email || '',
          soDienThoai: user.soDienThoai || user.phone || '',
          diaChi: user.diaChi || user.address || '',
          ngaySinh: user.ngaySinh || user.dateOfBirth || '',
          gioiTinh: user.gioiTinh || user.gender || '',
          cccd: user.cccd || user.idCard || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Fallback to user context data
      setFormData({
        hoTen: user.hoTen || '',
        email: user.email || '',
        soDienThoai: user.soDienThoai || user.phone || '',
        diaChi: user.diaChi || user.address || '',
        ngaySinh: user.ngaySinh || user.dateOfBirth || '',
        gioiTinh: user.gioiTinh || user.gender || '',
        cccd: user.cccd || user.idCard || ''
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      
      const endpoint = user.role === 'CUSTOMER' 
        ? '/api/khach-hang/update-profile' 
        : '/api/nhanvien/update-profile'
      
      const response = await api.put(endpoint, formData)
      
      if (response.data.success) {
        // Cập nhật user context
        const updatedUser = { ...user, ...formData }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        toast.success('Cập nhật thông tin thành công!')
        setIsEditing(false)
      } else {
        toast.error(response.data.message || 'Cập nhật thất bại')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    try {
      setLoading(true)
      
      const endpoint = '/api/auth/change-password'
      const response = await api.put(endpoint, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (response.data.success) {
        toast.success('Đổi mật khẩu thành công!')
        setShowPasswordForm(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(response.data.message || 'Đổi mật khẩu thất bại')
      }
    } catch (error) {
      console.error('Change password error:', error)
      toast.error('Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getUserDisplayName(user)}
              </h1>
              <p className="text-gray-600">{getRoleDisplayName(user?.role)}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    // Reset form data
                    setFormData({
                      hoTen: user.hoTen || '',
                      email: user.email || '',
                      soDienThoai: user.soDienThoai || user.phone || '',
                      diaChi: user.diaChi || user.address || '',
                      ngaySinh: user.ngaySinh || user.dateOfBirth || '',
                      gioiTinh: user.gioiTinh || user.gender || '',
                      cccd: user.cccd || user.idCard || ''
                    })
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900">
                <User className="w-4 h-4 text-gray-400" />
                <span>{user?.hoTen || 'Chưa cập nhật'}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center space-x-2 text-gray-900">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user?.email || 'Chưa cập nhật'}</span>
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{user?.soDienThoai || user?.phone || 'Chưa cập nhật'}</span>
              </div>
            )}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            {isEditing ? (
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{user?.diaChi || user?.address || 'Chưa cập nhật'}</span>
              </div>
            )}
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            {isEditing ? (
              <input
                type="date"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{user?.ngaySinh || user?.dateOfBirth || 'Chưa cập nhật'}</span>
              </div>
            )}
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            {isEditing ? (
              <select
                name="gioiTinh"
                value={formData.gioiTinh}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <div className="flex items-center space-x-2 text-gray-900">
                <User className="w-4 h-4 text-gray-400" />
                <span>{user?.gioiTinh || user?.gender || 'Chưa cập nhật'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h2>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showPasswordForm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPasswordForm ? 'Ẩn' : 'Hiển thị'}</span>
          </button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              Đổi mật khẩu
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
