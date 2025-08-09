import { api } from './api'

// Dashboard Service for Staff
export const dashboardService = {
  // Get staff dashboard statistics
  getStaffStats: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/stats')

      return response.data
    } catch (error) {
      console.error('Error fetching staff stats:', error)
      throw error
    }
  },

  // Get today's check-ins (from dashboard service)
  getTodayCheckIns: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/today-checkins')
      return response.data
    } catch (error) {
      console.error('Error fetching today check-ins:', error)
      throw error
    }
  },

  // Get today's check-outs (from dashboard service)
  getTodayCheckOuts: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/today-checkouts')
      return response.data
    } catch (error) {
      console.error('Error fetching today check-outs:', error)
      throw error
    }
  },

  // Get current guests (checked-in but not checked-out) for checkout page
  getCurrentGuests: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/current-guests')
      return response.data
    } catch (error) {
      console.error('Error fetching current guests:', error)
      throw error
    }
  }
}
