'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout title="Expense Management System - Admin Dashboard">
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={42}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pending Expenses"
              value={28}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Rules"
              value={5}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
