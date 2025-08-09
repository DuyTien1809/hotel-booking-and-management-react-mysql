import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Users, Star, Wifi, Car, Coffee, Dumbbell, MapPin, Phone, Mail, Award, Shield, Clock } from 'lucide-react'
import RoomSearch from '../../components/common/RoomSearch'
import RoomResult from '../../components/common/RoomResult'
import { api } from '../../services/api'
import { roomService } from '../../services/roomService'

const HomePage = () => {
  const [roomSearchResults, setRoomSearchResults] = useState([])

  const handleSearchResult = (results) => {
    setRoomSearchResults(results)
  }

  const [featuredRooms, setFeaturedRooms] = useState([])

  useEffect(() => {
    fetchFeaturedRooms()
  }, [])

  const fetchFeaturedRooms = async () => {
    try {
      // Gọi API để lấy phòng nổi bật hoặc lấy một số phòng mẫu
      const response = await roomService.getAllRooms()
      if (response.statusCode === 200 && response.phongList) {
        // Lấy 6 phòng đầu tiên làm phòng nổi bật
        const featured = response.phongList.slice(0, 6).map(room => ({
          id: room.soPhong,
          name: `Phòng ${room.soPhong}`,
          type: room.tenKp || 'Standard',
          category: room.tenLp || 'Single',
          price: room.giaPhong || 500000,
          rating: 4.5,
          image: '/api/placeholder/400/300',
          amenities: ['Wifi miễn phí', 'Điều hòa', 'TV', 'Minibar'],
          description: room.moTaKp || 'Phòng thoải mái với đầy đủ tiện nghi'
        }))
        setFeaturedRooms(featured)
      } else {
        // Fallback data nếu API không có dữ liệu
        setFeaturedRooms([])
      }
    } catch (error) {
      console.error('Error fetching featured rooms:', error)
      // Fallback to empty array if API fails
      setFeaturedRooms([])
    }
  }

  const [services, setServices] = useState([])

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      // Gọi API để lấy danh sách dịch vụ nổi bật
      const response = await api.get('/api/dich-vu/featured')
      setServices(response.data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to default services if API fails
      setServices([
        {
          icon: Wifi,
          title: 'Wifi miễn phí',
          description: 'Kết nối internet tốc độ cao trong toàn bộ khách sạn'
        },
        {
          icon: Car,
          title: 'Bãi đỗ xe',
          description: 'Bãi đỗ xe rộng rãi, an toàn cho khách hàng'
        },
        {
          icon: Coffee,
          title: 'Nhà hàng',
          description: 'Nhà hàng phục vụ các món ăn ngon, đa dạng'
        },
        {
          icon: Dumbbell,
          title: 'Phòng gym',
          description: 'Phòng tập gym hiện đại với đầy đủ thiết bị'
        }
      ])
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/home.webp"
            alt="Hotel Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp">
              Khách Sạn Sang Trọng
              <span className="block text-3xl md:text-5xl text-yellow-400 mt-2">
                Trải Nghiệm Đẳng Cấp
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Chào mừng bạn đến với không gian nghỉ dưỡng tuyệt vời, nơi sự thoải mái
              và dịch vụ chất lượng cao hòa quyện cùng thiết kế hiện đại
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-6xl mx-auto animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Tìm Kiếm Phòng Lý Tưởng
              </h3>
              <RoomSearch handleSearchResult={handleSearchResult} />
            </div>


          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {roomSearchResults.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kết quả tìm kiếm</h2>
            <RoomResult roomSearchResults={roomSearchResults} />
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Về Khách Sạn Của Chúng Tôi
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong ngành khách sạn, chúng tôi tự hào mang đến
                cho quý khách những trải nghiệm nghỉ dưỡng đẳng cấp nhất. Từ thiết kế nội thất
                sang trọng đến dịch vụ chu đáo, mọi chi tiết đều được chăm chút tỉ mỉ.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <Award className="w-6 h-6 text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Chất lượng 5 sao</h4>
                    <p className="text-gray-600 text-sm">Được chứng nhận bởi các tổ chức uy tín</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-6 h-6 text-emerald-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">An toàn tuyệt đối</h4>
                    <p className="text-gray-600 text-sm">Hệ thống bảo mật hiện đại</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <Clock className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phục vụ 24/7</h4>
                    <p className="text-gray-600 text-sm">Luôn sẵn sàng hỗ trợ quý khách</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <MapPin className="w-6 h-6 text-rose-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Vị trí đắc địa</h4>
                    <p className="text-gray-600 text-sm">Trung tâm thành phố, giao thông thuận lợi</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/abouthotel.jpg"
                alt="Hotel Interior"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Phòng Nổi Bật</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá các loại phòng tuyệt vời với thiết kế hiện đại và tiện nghi đầy đủ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room, index) => (
              <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover animate-fadeInUp" style={{animationDelay: `${0.1 * index}s`}}>
                <div className="relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{room.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {room.price?.toLocaleString('vi-VN')}₫
                      </div>
                      <div className="text-sm text-gray-500">/đêm</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {room.type}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {room.category}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/rooms/${room.id}`}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 rounded-xl font-semibold transition-colors duration-200 btn-glow"
                  >
                    Xem Chi Tiết & Đặt Phòng
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-xl font-semibold transition-all duration-200"
            >
              Xem Tất Cả Phòng
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dịch Vụ Đẳng Cấp</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những tiện ích và dịch vụ cao cấp được thiết kế để mang lại trải nghiệm hoàn hảo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="group text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Sẵn Sàng Đặt Phòng?
              </h2>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Liên hệ với chúng tôi ngay hôm nay để được tư vấn và đặt phòng với giá tốt nhất.
                Đội ngũ chăm sóc khách hàng chuyên nghiệp luôn sẵn sàng hỗ trợ bạn 24/7.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Hotline</div>
                    <div className="text-primary-100">1900 1234 (24/7)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-primary-100">booking@hotel.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Địa chỉ</div>
                    <div className="text-primary-100">123 Đường ABC, Quận 1, TP.HCM</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Đặt Phòng Ngay</h3>
              <div className="space-y-4">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-xl transition-colors duration-200 btn-glow">
                  Gọi Ngay: 1900 1234
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-white text-white font-semibold py-4 rounded-xl transition-all duration-200 btn-glow">
                  Chat Trực Tuyến
                </button>
                <Link
                  to="/rooms"
                  className="block w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 rounded-xl text-center transition-all duration-200 btn-glow"
                >
                  Xem Tất Cả Phòng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng Ký Nhận Ưu Đãi</h2>
            <p className="text-gray-400 mb-8">
              Nhận thông tin về các chương trình khuyến mãi và ưu đãi đặc biệt từ chúng tôi
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors duration-200 btn-glow">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
