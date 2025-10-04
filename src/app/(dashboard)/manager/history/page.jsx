'use client';

import React, { useState } from 'react';
import {
  Table,
  Tag,
  Typography,
  Space,
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Tooltip
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  FilterOutlined
} from '@ant-design/icons';
import ManagerLayout from '@/components/ManagerLayout';
import { mockApprovedExpenses, teamMembers } from '@/data/mockData';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Extended mock data for approval history
const mockApprovalHistory = [
  ...mockApprovedExpenses,
  {
    id: 7,
    userId: 4,
    userName: 'Alice Johnson',
    userEmail: 'alice.johnson@company.com',
    category: 'Travel',
    description: 'Conference attendance travel',
    expenseDate: '2025-09-20',
    originalAmount: 1200.00,
    originalCurrencyCode: 'USD',
    convertedAmount: 1200.00,
    baseCurrencyCode: 'USD',
    status: 'Rejected',
    remarks: 'Travel expenses for industry conference',
    submittedAt: '2025-09-21T10:00:00Z',
    createdAt: '2025-09-21T10:00:00Z',
    updatedAt: '2025-09-22T16:45:00Z',
    receiptUrl: '/receipts/travel_receipt_007.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Rejected',
        comment: 'Conference not in approved list for this quarter',
        updatedAt: '2025-09-22T16:45:00Z'
      }
    ],
    canCurrentUserApprove: false
  },
  {
    id: 8,
    userId: 5,
    userName: 'Bob Wilson',
    userEmail: 'bob.wilson@company.com',
    category: 'Food',
    description: 'Client lunch meeting',
    expenseDate: '2025-09-15',
    originalAmount: 85.50,
    originalCurrencyCode: 'USD',
    convertedAmount: 85.50,
    baseCurrencyCode: 'USD',
    status: 'Approved',
    remarks: 'Lunch with key client to discuss renewal',
    submittedAt: '2025-09-16T09:30:00Z',
    createdAt: '2025-09-16T09:30:00Z',
    updatedAt: '2025-09-16T14:20:00Z',
    receiptUrl: '/receipts/lunch_receipt_008.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Approved',
        comment: 'Valid business expense - client relationship',
        updatedAt: '2025-09-16T14:20:00Z'
      }
    ],
    canCurrentUserApprove: false
  },
  {
    id: 9,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    category: 'Transportation',
    description: 'Uber rides for client visits',
    expenseDate: '2025-09-10',
    originalAmount: 45.75,
    originalCurrencyCode: 'USD',
    convertedAmount: 45.75,
    baseCurrencyCode: 'USD',
    status: 'Approved',
    remarks: 'Multiple client site visits',
    submittedAt: '2025-09-11T08:15:00Z',
    createdAt: '2025-09-11T08:15:00Z',
    updatedAt: '2025-09-11T11:30:00Z',
    receiptUrl: '/receipts/uber_receipt_009.pdf',
    currentApprovalStep: 1,
    approvalHistory: [
      {
        stepOrder: 1,
        approverUserId: 2,
        approverName: 'Jane Smith',
        isRequired: true,
        status: 'Approved',
        comment: 'Approved - necessary transportation',
        updatedAt: '2025-09-11T11:30:00Z'
      }
    ],
    canCurrentUserApprove: false
  }
];

export default function HistoryPage() {
  const [filteredData, setFilteredData] = useState(mockApprovalHistory);
  const [selectedEmployee, setSelectedEmployee] = useState(undefined);
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

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

  const applyFilters = () => {
    let filtered = mockApprovalHistory;

    if (selectedEmployee) {
      filtered = filtered.filter(expense => expense.userId.toString() === selectedEmployee);
    }

    if (selectedStatus) {
      filtered = filtered.filter(expense => expense.status === selectedStatus);
    }

    if (selectedDateRange) {
      const [startDate, endDate] = selectedDateRange;
      filtered = filtered.filter(expense => {
        const expenseDate = dayjs(expense.updatedAt);
        return expenseDate.isAfter(startDate.startOf('day')) && expenseDate.isBefore(endDate.endOf('day'));
      });
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setSelectedEmployee(undefined);
    setSelectedStatus(undefined);
    setSelectedDateRange(null);
    setFilteredData(mockApprovalHistory);
  };

  const getApprovalStats = () => {
    const approved = filteredData.filter(e => e.status === 'Approved').length;
    const rejected = filteredData.filter(e => e.status === 'Rejected').length;
    const totalAmount = filteredData
      .filter(e => e.status === 'Approved')
      .reduce((sum, e) => sum + e.convertedAmount, 0);

    return { approved, rejected, totalAmount };
  };

  const stats = getApprovalStats();

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined />
            <Text strong>{record.userName}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.userEmail}
          </Text>
        </div>
      ),
    },
    {
      title: 'Description & Category',
      key: 'description',
      render: (record) => (
        <div>
          <Text strong>{record.description}</Text>
          <br />
          <Tag color={getCategoryColor(record.category)}>{record.category}</Tag>
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>
            {formatCurrency(record.convertedAmount, record.baseCurrencyCode)}
          </Text>
          {record.originalCurrencyCode !== record.baseCurrencyCode && (
            <div>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                from {formatCurrency(record.originalAmount, record.originalCurrencyCode)}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Decision',
      key: 'decision',
      render: (record) => {
        const approvalStep = record.approvalHistory.find(step => step.approverUserId === 2);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {record.status === 'Approved' ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
              <Tag color={record.status === 'Approved' ? 'green' : 'red'}>
                {record.status}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {new Date(record.updatedAt).toLocaleString()}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Comment',
      key: 'comment',
      render: (record) => {
        const approvalStep = record.approvalHistory.find(step => step.approverUserId === 2);
        return (
          <div style={{ maxWidth: 200 }}>
            {approvalStep?.comment ? (
              <Tooltip title={approvalStep.comment}>
                <Text ellipsis style={{ fontSize: '12px' }}>
                  {approvalStep.comment}
                </Text>
              </Tooltip>
            ) : (
              <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                No comment
              </Text>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <ManagerLayout title="Approval History">
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Approval History</Title>
        <Text type="secondary">
          Review your past approval decisions and track expense patterns.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
              <div>
                <Text type="secondary">Approved</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.approved}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
              <div>
                <Text type="secondary">Rejected</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  {stats.rejected}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
              <div>
                <Text type="secondary">Total Approved</Text>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                  {formatCurrency(stats.totalAmount, 'USD')}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FilterOutlined />
          <Text strong>Filters</Text>
        </div>
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Select Employee"
              style={{ width: '100%' }}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              allowClear
            >
              {teamMembers.map(member => (
                <Option key={member.id} value={member.id.toString()}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Select Status"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={selectedDateRange}
              onChange={(dates) => setSelectedDateRange(dates)}
            />
          </Col>
          <Col xs={24} sm={4}>
            <Space>
              <Button type="primary" onClick={applyFilters}>
                Apply
              </Button>
              <Button onClick={clearFilters}>
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* History Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} expenses`
        }}
        scroll={{ x: true }}
      />
    </ManagerLayout>
  );
}