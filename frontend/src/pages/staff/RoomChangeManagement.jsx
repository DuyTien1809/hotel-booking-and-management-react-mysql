import React, { useState, useEffect } from 'react'
import RoomChangeHistory from '../../components/staff/RoomChangeHistory'
import doiPhongService from '../../services/doiPhongService'
import toast from 'react-hot-toast'

const RoomChangeManagement = () => {
  const [activeTab, setActiveTab] = useState('current')
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1) // Last month

      const response = await doiPhongService.getRoomChangeStatistics(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )
      
      if (response.statusCode === 200) {
        setStatistics(response.statistics)
      }
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'current', label: 'Đổi phòng hiện tại', icon: '🔄' },
    { id: 'history', label: 'Lịch sử đổi phòng', icon: '📋' },  
    { id: 'statistics', label: 'Thống kê', icon: '📊' }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý đổi phòng</h1>
        <p className="text-gray-600">Theo dõi và quản lý các yêu cầu đổi phòng của khách hàng</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đổi phòng hôm nay</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thành công tuần này</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tháng này</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics && statistics.length > 0 ? statistics[0][2] : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'current' && (
            <RoomChangeHistory showAll={false} />
          )}

          {activeTab === 'history' && (
            <RoomChangeHistory showAll={true} />
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Thống kê đổi phòng</h3>
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Thống kê theo tháng (30 ngày gần nhất)</h4>
                    {statistics && statistics.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Tháng/Năm</th>
                              <th className="text-left py-2">Số lần đổi phòng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {statistics.map((stat, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">{stat[0]}/{stat[1]}</td>
                                <td className="py-2">{stat[2]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">Chưa có dữ liệu thống kê</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Xu hướng đổi phòng</h4>
                      <p className="text-blue-600">Đang phát triển tính năng biểu đồ...</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Phòng được đổi nhiều nhất</h4>
                      <p className="text-green-600">Đang phát triển tính năng thống kê...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomChangeManagement
