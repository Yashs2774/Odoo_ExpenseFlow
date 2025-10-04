'use client'

import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import LoginForm from '../../components/LoginForm'
import AppLayout from '../../components/AppLayout'
import ExpenseForm from '../../components/ExpenseForm'

function NewExpenseContent() {
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
    <AppLayout activeKey="new-expense">
      <ExpenseForm />
    </AppLayout>
  )
}

export default function NewExpensePage() {
  return (
    <AuthProvider>
      <NewExpenseContent />
    </AuthProvider>
  )
}