'use client'

import { AuthProvider, useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/LoginForm'
import AppLayout from '../components/AppLayout'
import ExpenseDashboard from '../components/ExpenseDashboard'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <AppLayout activeKey="dashboard">
      <ExpenseDashboard />
    </AppLayout>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}