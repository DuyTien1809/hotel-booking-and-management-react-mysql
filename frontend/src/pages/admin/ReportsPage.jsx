import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  FileSpreadsheet
} from 'lucide-react'

const ReportsPage = () => {
  // Get current month's first and last day
  const getCurrentMonthRange = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // First day of current month
    const firstDay = new Date(year, month, 1)
    // Last day of current month
    const lastDay = new Date(year, month + 1, 0)

    return {
      startDate: firstDay.toISOString().split('T')[0], // Format: YYYY-MM-DD
      endDate: lastDay.toISOString().split('T')[0]
    }
  }

  const [dateRange, setDateRange] = useState(getCurrentMonthRange())

  // Add print styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        body { font-size: 12px; }
        .card { box-shadow: none; border: 1px solid #ddd; }
        table { font-size: 11px; }
        .page-break { page-break-before: always; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  const [reportType, setReportType] = useState('revenue')
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [bookingStatus, setBookingStatus] = useState('ALL')

  useEffect(() => {
    fetchReportData()
  }, [dateRange, reportType, bookingStatus])

  const fetchReportData = async () => {
    try {
      setLoading(true)

      // Gọi API để lấy dữ liệu báo cáo
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: reportType
      }

      // Thêm status cho báo cáo đặt phòng
      if (reportType === 'booking') {
        params.status = bookingStatus
      }

      const response = await api.get('/api/reports', { params })

      if (response.data.statusCode === 200) {
        setReportData(response.data.data || {})
      } else {
        console.error('Error:', response.data.message)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const exportReport = async (format) => {
    try {
      setLoading(true)

      if (reportType === 'booking') {
        // Sử dụng dữ liệu hiện tại thay vì gọi API mới
        if (reportData && reportData.details) {
          if (format === 'excel') {
            exportToExcel(reportData)
          }
        } else {
          alert('Không có dữ liệu để xuất. Vui lòng tải dữ liệu báo cáo trước.')
        }
      } else {
        alert('Chức năng xuất Excel chỉ khả dụng cho báo cáo đặt phòng')
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      alert('Có lỗi xảy ra khi xuất báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const printReport = () => {
    window.print()
  }

  const exportToExcel = (data) => {
    if (!data || !data.details || data.details.length === 0) {
      alert('Không có dữ liệu để xuất')
      return
    }

    // Tạo dữ liệu cho Excel với tất cả các cột từ stored procedure
    const excelData = []

    // Header - tất cả các cột từ temp_bao_cao trong stored procedure
    excelData.push([
      'ID Phiếu đặt',
      'Ngày đặt',
      'Ngày bắt đầu thuê',
      'Ngày đi',
      'Số ngày ở',
      'Trạng thái gốc',
      'Số tiền cọc (VNĐ)',
      'CCCD khách',
      'Họ tên khách',
      'SĐT khách',
      'Email khách',
      'ID nhân viên đặt',
      'Họ tên nhân viên đặt',
      'ID phiếu thuê',
      'Ngày check-in thực tế',
      'Số phòng đặt',
      'Chi tiết phòng',
      'Tổng tiền phòng (VNĐ)'
    ])

    // Data rows - tất cả các cột từ stored procedure
    data.details.forEach(booking => {
      excelData.push([
        booking.idPd || '',
        booking.ngayDat || '',
        booking.ngayBdThue || '',
        booking.ngayDi || '',
        booking.soNgayO || 0,
        booking.trangThaiGoc || '',
        booking.soTienCoc || 0,
        booking.cccdKhach || '',
        booking.hoTenKhach || '',
        booking.sdtKhach || '',
        booking.emailKhach || '',
        booking.idNvDat || '',
        booking.hoTenNvDat || '',
        booking.idPt || '',
        booking.ngayCheckInThucTe || '',
        booking.soPhongDat || 0,
        booking.chiTietPhong || '',
        booking.tongTienPhong || 0
      ])
    })

    // Tạo CSV content
    const csvContent = excelData.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')

    // Tạo và download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bao-cao-dat-phong-${dateRange.startDate}-${dateRange.endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    alert('Báo cáo Excel đã được tải xuống thành công!')
  }

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (growth < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    }
    return <Activity className="w-4 h-4 text-gray-600" />
  }

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">Phân tích dữ liệu hoạt động kinh doanh</p>
        </div>
        <div className="flex space-x-3 no-print">
          <button
            onClick={() => fetchReportData()}
            className="btn-outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>

          <button
            onClick={() => exportReport('excel')}
            className="btn-primary"
            disabled={loading || !(reportType === 'booking' && reportData && reportData.details && reportData.details.length > 0)}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card no-print">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Bộ lọc báo cáo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại báo cáo
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
            >
              <option value="booking">Đặt phòng</option>
              <option value="revenue">Doanh thu</option>
              <option value="occupancy">Tỷ lệ lấp đầy</option>
              <option value="customer">Khách hàng</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              className="input"
              disabled={reportType !== 'booking'}
            >
              <option value="ALL">Tất cả</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã check-in">Đã check-in</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Report */}
      {reportType === 'booking' && reportData && (
        <div className="space-y-6 overflow-x-hidden">
          {/* Booking Summary */}
          {reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng số phiếu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongSoPhieu || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng tiền cọc</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongTienCoc || '0'} VNĐ
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng phòng đặt</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongSoPhongDat || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Số ngày ở TB</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.soNgayOTb || 0} ngày
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng tiền phòng</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongTienPhong || '0'} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Details Table */}
          {reportData.details && reportData.details.length > 0 && (
            <div className="card overflow-x-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết đặt phòng</h3>
                <span className="text-sm text-gray-500">
                  Tổng: {reportData.totalRecords} bản ghi
                </span>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="inline-block align-top" style={{ minWidth: '1900px' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID phiếu</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ngày đặt</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ngày bắt đầu thuê</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ngày đi</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Số ngày ở</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Số tiền cọc</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">CCCD khách</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Họ tên khách</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">SĐT khách</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email khách</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID NV đặt</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Họ tên NV đặt</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID phiếu thuê</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ngày check-in thực tế</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Số phòng đặt</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Chi tiết phòng</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tổng tiền phòng</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.details.map((booking, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.idPd}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.ngayDat}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.ngayBdThue}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.ngayDi}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.soNgayO}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.trangThaiGoc === 'Đã xác nhận' ? 'bg-green-100 text-green-800' :
                            booking.trangThaiGoc === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' :
                            booking.trangThaiGoc === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.trangThaiGoc}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.soTienCoc?.toLocaleString()} VNĐ</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.cccdKhach}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.hoTenKhach}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.sdtKhach}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.emailKhach}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.idNvDat || '-'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.hoTenNvDat || '-'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.idPt || '-'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.ngayCheckInThucTe || '-'}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.soPhongDat}</td>
                        <td className="px-3 py-3 text-sm text-gray-900">{booking.chiTietPhong}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{booking.tongTienPhong?.toLocaleString()} VNĐ</td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData?.total ? (reportData.total / 1000000).toFixed(0) : 0}M VNĐ
                  </p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(reportData?.growth || 0)}
                    <span className={`text-sm ml-1 ${getGrowthColor(reportData?.growth || 0)}`}>
                      {reportData?.growth || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu/ngày</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData?.daily ? (reportData.daily / 1000000).toFixed(1) : 0}M VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu/tháng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData?.monthly ? (reportData.monthly / 1000000).toFixed(0) : 0}M VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nguồn chính</p>
                  <p className="text-2xl font-bold text-gray-900">Phòng</p>
                  <p className="text-sm text-gray-500">76.5%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo dịch vụ</h3>
              <div className="space-y-4">
                {(reportData?.byService || []).map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                        <span className="text-sm text-gray-600">{service.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {(service.value / 1000000).toFixed(0)}M VNĐ
                      </p>
                    </div>
                  </div>
                ))}
                {(!reportData?.byService || reportData.byService.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Chưa có dữ liệu doanh thu theo dịch vụ</p>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ doanh thu</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Biểu đồ doanh thu theo thời gian</p>
                  <p className="text-sm text-gray-400 mt-2">Tích hợp Chart.js</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default ReportsPage
