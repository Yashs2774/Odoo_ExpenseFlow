import { Inter } from 'next/font/google'
import './globals.css'
import { ConfigProvider } from 'antd'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Expense Management - Employee Portal',
  description: 'Employee portal for expense management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}