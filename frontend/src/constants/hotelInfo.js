// Thông tin khách sạn
export const HOTEL_INFO = {
  name: 'KHÁCH SẠN HOTEL BOOKING',
  address: '97 Man Thiện, Hiệp Phú, Thủ Đức, Hồ Chí Minh',
  phone: '0563560789',
  email: 'info@hotelbooking.com',
  website: 'www.hotelbooking.com',
  logo: '/images/hotel-logo.png', // Đường dẫn đến logo
  taxCode: '0123456789', // Mã số thuế
  bankInfo: {
    bankName: 'MB Bank',
    accountNumber: '0818181948',
    accountName: 'KHÁCH SẠN HOTEL BOOKING'
  }
}

// Trạng thái hóa đơn
export const INVOICE_STATUS = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  PARTIAL: 'Thanh toán một phần'
}

// Phương thức thanh toán
export const PAYMENT_METHODS = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CARD: 'card'
}

// Nhãn phương thức thanh toán
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Tiền mặt',
  [PAYMENT_METHODS.TRANSFER]: 'Chuyển khoản',
  [PAYMENT_METHODS.CARD]: 'Thẻ tín dụng'
}
