'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { message } from 'antd'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      // Mock API call - replace with actual API
      const mockUser = {
        user_id: 1,
        name: 'John Doe',
        email: email,
        role: 'Employee',
        company_id: 1,
        manager_id: 2,
        company: {
          name: 'Demo Company',
          base_currency_code: 'USD',
          country: 'United States'
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      message.success('Login successful!')
      return { success: true }
    } catch (error) {
      message.error('Login failed!')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    message.success('Logged out successfully!')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}