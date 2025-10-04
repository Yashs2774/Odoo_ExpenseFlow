'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Button, List, Typography, Tag, Space } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ManagerLayout from '@/components/ManagerLayout';
import { mockDashboardStats, mockExpensesForApproval } from '@/data/mockData';

const { Title, Text } = Typography;

export default function ManagerDashboard() {
  const stats = mockDashboardStats;
  const recentExpenses = mockExpensesForApproval.slice(0, 3); // Show first 3 for quick preview

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': 'blue',
      'Food': 'green',
      'Lodging': 'purple',
      'Transportation': 'orange',
      'Supplies': 'cyan'
    };
    return colors[category] || 'default';
  };

  return (
    <ManagerLayout title="Manager Dashboard">
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Overview</Title>
        <Text type="secondary">
          Welcome back, {mockDashboardStats.totalTeamMembers} team members are counting on your approvals.
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Pending Approvals"
              value={stats.pendingApprovals}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Approved This Month"
              value={stats.approvedThisMonth}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Rejected This Month"
              value={stats.rejectedThisMonth}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Team Members"
              value={stats.totalTeamMembers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Avg. Approval Time"
              value={stats.avgApprovalTime}
              suffix="hours"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Highest Pending Amount"
              value={stats.highestPendingAmount}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => formatCurrency(Number(value), 'USD')}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Expenses Awaiting Approval"
            extra={
              <Link href="/approvals">
                <Button type="primary" size="small" icon={<EyeOutlined />}>
                  View All
                </Button>
              </Link>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={recentExpenses}
              renderItem={(expense) => (
                <List.Item
                  actions={[
                    <Tag color={getCategoryColor(expense.category)} key="category">
                      {expense.category}
                    </Tag>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{expense.description}</Text>
                        <Text type="secondary">by {expense.userName}</Text>
                      </Space>
                    }
                    description={
                      <div>
                        <Text>
                          {formatCurrency(expense.convertedAmount, expense.baseCurrencyCode)}
                          {expense.originalCurrencyCode !== expense.baseCurrencyCode && (
                            <Text type="secondary">
                              {' '}(from {formatCurrency(expense.originalAmount, expense.originalCurrencyCode)})
                            </Text>
                          )}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Submitted: {new Date(expense.submittedAt).toLocaleDateString()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Link href="/approvals">
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  icon={<CheckCircleOutlined />}
                >
                  Review Pending Approvals ({stats.pendingApprovals})
                </Button>
              </Link>
              <Link href="/team">
                <Button 
                  type="default" 
                  size="large" 
                  block 
                  icon={<TeamOutlined />}
                >
                  Manage My Team
                </Button>
              </Link>
              <Link href="/history">
                <Button 
                  type="default" 
                  size="large" 
                  block 
                  icon={<ClockCircleOutlined />}
                >
                  View Approval History
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </ManagerLayout>
  );
}