'use client';

import React from 'react';
import { Card, Row, Col, Avatar, Typography, Tag, List, Statistic, Divider } from 'antd';
import { UserOutlined, MailOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ManagerLayout from '@/components/ManagerLayout';
import { teamMembers, mockExpensesForApproval, mockApprovedExpenses } from '@/data/mockData';

const { Title, Text } = Typography;

export default function TeamPage() {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getTeamMemberStats = (userId) => {
    const pendingExpenses = mockExpensesForApproval.filter(e => e.userId === userId);
    const approvedExpenses = mockApprovedExpenses.filter(e => e.userId === userId);
    
    return {
      pendingCount: pendingExpenses.length,
      pendingAmount: pendingExpenses.reduce((sum, e) => sum + e.convertedAmount, 0),
      approvedCount: approvedExpenses.length,
      approvedAmount: approvedExpenses.reduce((sum, e) => sum + e.convertedAmount, 0)
    };
  };

  return (
    <ManagerLayout title="My Team">
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Team Overview</Title>
        <Text type="secondary">
          Manage and monitor your direct reports and their expense submissions.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {teamMembers.map((member) => {
          const stats = getTeamMemberStats(member.id);
          
          return (
            <Col xs={24} sm={12} lg={8} key={member.id}>
              <Card 
                hoverable
                style={{ height: '100%' }}
              >
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar 
                    size={64} 
                    style={{ backgroundColor: '#1890ff', marginBottom: 12 }}
                    icon={<UserOutlined />}
                  />
                  <div>
                    <Title level={4} style={{ marginBottom: 4 }}>{member.name}</Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <MailOutlined style={{ fontSize: '12px', color: '#999' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{member.email}</Text>
                    </div>
                    <Tag color="blue" style={{ marginTop: 8 }}>{member.role}</Tag>
                    <Tag color={member.isActive ? 'green' : 'red'}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>

                <Divider />

                <div style={{ marginBottom: 16 }}>
                  <Title level={5} style={{ marginBottom: 12 }}>Expense Statistics</Title>
                  
                  <Row gutter={8}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff7e6', borderRadius: 4 }}>
                        <ClockCircleOutlined style={{ color: '#fa8c16', marginBottom: 4 }} />
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fa8c16' }}>
                          {stats.pendingCount}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Pending</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f6ffed', borderRadius: 4 }}>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginBottom: 4 }} />
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                          {stats.approvedCount}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Approved</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div>
                  <Text strong style={{ fontSize: '12px', color: '#666' }}>PENDING AMOUNT</Text>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {formatCurrency(stats.pendingAmount, 'USD')}
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <Text strong style={{ fontSize: '12px', color: '#666' }}>TOTAL APPROVED</Text>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                    {formatCurrency(stats.approvedAmount, 'USD')}
                  </div>
                </div>

                <div style={{ marginTop: 12, fontSize: '11px', color: '#999' }}>
                  Member since: {new Date(member.createdAt).toLocaleDateString()}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div style={{ marginTop: 32 }}>
        <Title level={4}>Team Summary</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Team Members"
                value={teamMembers.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Pending Expenses"
                value={teamMembers.reduce((total, member) => {
                  const stats = getTeamMemberStats(member.id);
                  return total + stats.pendingCount;
                }, 0)}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Pending Amount"
                value={teamMembers.reduce((total, member) => {
                  const stats = getTeamMemberStats(member.id);
                  return total + stats.pendingAmount;
                }, 0)}
                formatter={(value) => formatCurrency(Number(value), 'USD')}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ManagerLayout>
  );
}