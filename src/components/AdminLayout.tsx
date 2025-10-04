'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname();
  
  const menuItems = [
    {
      key: 'dashboard',
      icon: <FileTextOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">User Management</Link>,
    },
    {
      key: 'approval-rules',
      icon: <SettingOutlined />,
      label: <Link href="/admin/approval-rules">Approval Rules</Link>,
    },
  ];

  // Determine selected key based on current path
  const getSelectedKey = () => {
    if (pathname === '/') return ['dashboard'];
    if (pathname.startsWith('/users')) return ['users'];
    if (pathname.startsWith('/approval-rules')) return ['approval-rules'];
    return ['dashboard'];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ 
          height: 64, 
          margin: 16, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1890ff',
          borderRadius: 8,
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          EMS Admin
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            {title}
          </h1>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff', 
          minHeight: 280,
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}